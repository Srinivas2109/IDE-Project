//! Sample Rust Project for Code AI IDE
//! A simple web scraper and data processor demonstrating Rust features.

use std::collections::HashMap;
use std::sync::Arc;
use std::time::Duration;

use anyhow::{Context, Result};
use chrono::{DateTime, Utc};
use clap::Parser;
use serde::{Deserialize, Serialize};
use tokio::sync::RwLock;
use uuid::Uuid;

mod scraper;
mod processor;
mod storage;
mod error;

use scraper::{WebScraper, ScrapedData};
use processor::{DataProcessor, ProcessedData};
use storage::{DataStorage, StorageBackend};
use error::AppError;

/// Configuration for the web scraper application
#[derive(Debug, Parser)]
#[command(name = "web-scraper")]
#[command(about = "A sample web scraper demonstrating Rust features")]
struct Config {
    /// URLs to scrape
    #[arg(short, long, value_delimiter = ',')]
    urls: Vec<String>,
    
    /// Output file path
    #[arg(short, long, default_value = "output.json")]
    output: String,
    
    /// Maximum concurrent requests
    #[arg(short, long, default_value = "5")]
    max_concurrent: usize,
    
    /// Request timeout in seconds
    #[arg(short, long, default_value = "30")]
    timeout: u64,
    
    /// Enable verbose logging
    #[arg(short, long)]
    verbose: bool,
}

/// Application state shared across async tasks
#[derive(Debug)]
struct AppState {
    config: Config,
    storage: Arc<DataStorage>,
    processor: Arc<DataProcessor>,
    metrics: Arc<RwLock<AppMetrics>>,
}

/// Application metrics and statistics
#[derive(Debug, Default)]
struct AppMetrics {
    total_requests: usize,
    successful_requests: usize,
    failed_requests: usize,
    total_data_size: usize,
    processing_time: Duration,
}

impl AppMetrics {
    fn record_request(&mut self, success: bool, data_size: usize) {
        self.total_requests += 1;
        if success {
            self.successful_requests += 1;
        } else {
            self.failed_requests += 1;
        }
        self.total_data_size += data_size;
    }
    
    fn record_processing_time(&mut self, duration: Duration) {
        self.processing_time += duration;
    }
    
    fn success_rate(&self) -> f64 {
        if self.total_requests == 0 {
            0.0
        } else {
            self.successful_requests as f64 / self.total_requests as f64
        }
    }
}

/// Main application entry point
#[tokio::main]
async fn main() -> Result<()> {
    // Parse command line arguments
    let config = Config::parse();
    
    // Initialize logging
    if config.verbose {
        env_logger::init();
    }
    
    println!("🚀 Starting Web Scraper Application");
    println!("URLs to scrape: {}", config.urls.join(", "));
    println!("Output file: {}", config.output);
    println!("Max concurrent requests: {}", config.max_concurrent);
    
    // Initialize application components
    let storage = Arc::new(DataStorage::new(StorageBackend::File(config.output.clone()))?);
    let processor = Arc::new(DataProcessor::new()?);
    let metrics = Arc::new(RwLock::new(AppMetrics::default()));
    
    let app_state = AppState {
        config,
        storage,
        processor,
        metrics,
    };
    
    // Run the main application logic
    run_app(app_state).await?;
    
    println!("✅ Application completed successfully!");
    Ok(())
}

/// Main application logic
async fn run_app(state: AppState) -> Result<()> {
    let start_time = std::time::Instant::now();
    
    // Create a semaphore to limit concurrent requests
    let semaphore = Arc::new(tokio::sync::Semaphore::new(state.config.max_concurrent));
    
    // Create tasks for each URL
    let mut tasks = Vec::new();
    
    for url in &state.config.urls {
        let semaphore_clone = semaphore.clone();
        let state_clone = state.clone();
        let url_clone = url.clone();
        
        let task = tokio::spawn(async move {
            let _permit = semaphore_clone.acquire().await.unwrap();
            scrape_and_process_url(&state_clone, &url_clone).await
        });
        
        tasks.push(task);
    }
    
    // Wait for all tasks to complete
    let results: Vec<Result<()>> = futures::future::join_all(tasks).await
        .into_iter()
        .map(|r| r.unwrap_or_else(|e| Err(anyhow::anyhow!("Task failed: {}", e))))
        .collect();
    
    // Process results and update metrics
    let mut success_count = 0;
    for result in results {
        match result {
            Ok(()) => success_count += 1,
            Err(e) => {
                eprintln!("❌ Error processing URL: {}", e);
                let mut metrics = state.metrics.write().await;
                metrics.record_request(false, 0);
            }
        }
    }
    
    // Record final metrics
    let processing_time = start_time.elapsed();
    let mut metrics = state.metrics.write().await;
    metrics.record_processing_time(processing_time);
    
    // Print final statistics
    println!("\n📊 Final Statistics:");
    println!("Total requests: {}", metrics.total_requests);
    println!("Successful: {}", metrics.successful_requests);
    println!("Failed: {}", metrics.failed_requests);
    println!("Success rate: {:.2}%", metrics.success_rate() * 100.0);
    println!("Total data size: {} bytes", metrics.total_data_size);
    println!("Processing time: {:?}", metrics.processing_time);
    
    Ok(())
}

/// Scrape and process a single URL
async fn scrape_and_process_url(state: &AppState, url: &str) -> Result<()> {
    let start_time = std::time::Instant::now();
    
    println!("🔍 Scraping URL: {}", url);
    
    // Create scraper instance
    let scraper = WebScraper::new()?;
    
    // Scrape the URL
    let scraped_data = scraper.scrape(url).await
        .with_context(|| format!("Failed to scrape URL: {}", url))?;
    
    // Process the scraped data
    let processed_data = state.processor.process(&scraped_data).await?;
    
    // Store the processed data
    state.storage.store(&processed_data).await?;
    
    // Update metrics
    let processing_time = start_time.elapsed();
    let mut metrics = state.metrics.write().await;
    metrics.record_request(true, processed_data.size());
    metrics.record_processing_time(processing_time);
    
    println!("✅ Successfully processed URL: {} (took {:?})", url, processing_time);
    
    Ok(())
}

impl Clone for AppState {
    fn clone(&self) -> Self {
        Self {
            config: self.config.clone(),
            storage: Arc::clone(&self.storage),
            processor: Arc::clone(&self.processor),
            metrics: Arc::clone(&self.metrics),
        }
    }
}

impl Clone for Config {
    fn clone(&self) -> Self {
        Self {
            urls: self.urls.clone(),
            output: self.output.clone(),
            max_concurrent: self.max_concurrent,
            timeout: self.timeout,
            verbose: self.verbose,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_metrics_calculation() {
        let mut metrics = AppMetrics::default();
        
        metrics.record_request(true, 100);
        metrics.record_request(false, 0);
        metrics.record_request(true, 200);
        
        assert_eq!(metrics.total_requests, 3);
        assert_eq!(metrics.successful_requests, 2);
        assert_eq!(metrics.failed_requests, 1);
        assert_eq!(metrics.total_data_size, 300);
        assert!((metrics.success_rate() - 2.0/3.0).abs() < f64::EPSILON);
    }
    
    #[test]
    fn test_config_parsing() {
        let args = vec![
            "web-scraper",
            "-u", "https://example.com,https://test.com",
            "-o", "test_output.json",
            "-c", "10",
            "-t", "60",
            "-v"
        ];
        
        let config = Config::try_parse_from(args).unwrap();
        
        assert_eq!(config.urls, vec!["https://example.com", "https://test.com"]);
        assert_eq!(config.output, "test_output.json");
        assert_eq!(config.max_concurrent, 10);
        assert_eq!(config.timeout, 60);
        assert!(config.verbose);
    }
}
