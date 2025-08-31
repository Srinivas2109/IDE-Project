// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;
use tauri::api::dialog;
use tauri::Manager;

#[derive(Debug, Serialize, Deserialize)]
struct FileInfo {
    name: String,
    path: String,
    content: String,
    language: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct ProjectInfo {
    name: String,
    path: String,
    files: Vec<FileInfo>,
}

#[tauri::command]
async fn open_file_dialog() -> Result<Option<FileInfo>, String> {
    let window = tauri::Manager::app_handle(&tauri::AppHandle::default());
    
    let file_path = dialog::blocking::FileDialogBuilder::new()
        .add_filter("All Files", &["*"])
        .pick_file();
    
    match file_path {
        Some(path) => {
            let content = fs::read_to_string(&path)
                .map_err(|e| format!("Failed to read file: {}", e))?;
            
            let language = get_language_from_extension(&path);
            
            Ok(Some(FileInfo {
                name: path.file_name()
                    .and_then(|n| n.to_str())
                    .unwrap_or("Unknown")
                    .to_string(),
                path: path.to_string_lossy().to_string(),
                content,
                language,
            }))
        }
        None => Ok(None),
    }
}

#[tauri::command]
async fn save_file(path: String, content: String) -> Result<(), String> {
    fs::write(&path, content)
        .map_err(|e| format!("Failed to write file: {}", e))?;
    Ok(())
}

#[tauri::command]
async fn read_file(path: String) -> Result<String, String> {
    fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read file: {}", e))
}

#[tauri::command]
async fn list_directory(path: String) -> Result<Vec<String>, String> {
    let entries = fs::read_dir(&path)
        .map_err(|e| format!("Failed to read directory: {}", e))?;
    
    let mut files = Vec::new();
    for entry in entries {
        if let Ok(entry) = entry {
            if let Ok(file_name) = entry.file_name().into_string() {
                files.push(file_name);
            }
        }
    }
    
    Ok(files)
}

#[tauri::command]
async fn create_file(path: String, name: String) -> Result<(), String> {
    let full_path = Path::new(&path).join(&name);
    fs::write(&full_path, "")
        .map_err(|e| format!("Failed to create file: {}", e))?;
    Ok(())
}

#[tauri::command]
async fn create_directory(path: String, name: String) -> Result<(), String> {
    let full_path = Path::new(&path).join(&name);
    fs::create_dir(&full_path)
        .map_err(|e| format!("Failed to create directory: {}", e))?;
    Ok(())
}

#[tauri::command]
async fn delete_file(path: String) -> Result<(), String> {
    fs::remove_file(&path)
        .map_err(|e| format!("Failed to delete file: {}", e))?;
    Ok(())
}

#[tauri::command]
async fn delete_directory(path: String) -> Result<(), String> {
    fs::remove_dir_all(&path)
        .map_err(|e| format!("Failed to delete directory: {}", e))?;
    Ok(())
}

#[tauri::command]
async fn run_command(command: String, args: Vec<String>, cwd: Option<String>) -> Result<String, String> {
    use std::process::Command;
    
    let mut cmd = Command::new(&command);
    cmd.args(&args);
    
    if let Some(working_dir) = cwd {
        cmd.current_dir(working_dir);
    }
    
    let output = cmd.output()
        .map_err(|e| format!("Failed to execute command: {}", e))?;
    
    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

fn get_language_from_extension(path: &Path) -> String {
    match path.extension().and_then(|ext| ext.to_str()) {
        Some("rs") => "rust".to_string(),
        Some("py") => "python".to_string(),
        Some("js") => "javascript".to_string(),
        Some("ts") => "typescript".to_string(),
        Some("tsx") => "typescript".to_string(),
        Some("jsx") => "javascript".to_string(),
        Some("cs") => "csharp".to_string(),
        Some("java") => "java".to_string(),
        Some("cpp") => "cpp".to_string(),
        Some("c") => "c".to_string(),
        Some("go") => "go".to_string(),
        Some("php") => "php".to_string(),
        Some("rb") => "ruby".to_string(),
        Some("sql") => "sql".to_string(),
        Some("html") => "html".to_string(),
        Some("css") => "css".to_string(),
        Some("scss") => "scss".to_string(),
        Some("json") => "json".to_string(),
        Some("xml") => "xml".to_string(),
        Some("yaml") | Some("yml") => "yaml".to_string(),
        Some("md") => "markdown".to_string(),
        _ => "plaintext".to_string(),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            open_file_dialog,
            save_file,
            read_file,
            list_directory,
            create_file,
            create_directory,
            delete_file,
            delete_directory,
            run_command,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
