/**
 * Simple logging utility
 * Demonstrates TypeScript utility classes and method overloading.
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  context?: any;
}

export class Logger {
  private logLevel: LogLevel;
  private entries: LogEntry[] = [];
  private maxEntries: number;

  constructor(logLevel: LogLevel = LogLevel.INFO, maxEntries: number = 1000) {
    this.logLevel = logLevel;
    this.maxEntries = maxEntries;
  }

  /**
   * Set the minimum log level
   */
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  /**
   * Get current log level
   */
  getLogLevel(): LogLevel {
    return this.logLevel;
  }

  /**
   * Log a debug message
   */
  debug(message: string, context?: any): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Log an info message
   */
  info(message: string, context?: any): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: any): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Log an error message
   */
  error(message: string, context?: any): void {
    this.log(LogLevel.ERROR, message, context);
  }

  /**
   * Log a message with the specified level
   */
  private log(level: LogLevel, message: string, context?: any): void {
    if (level < this.logLevel) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      context
    };

    this.entries.push(entry);
    
    // Maintain max entries limit
    if (this.entries.length > this.maxEntries) {
      this.entries.shift();
    }

    // Format and output the log message
    const formattedMessage = this.formatLogEntry(entry);
    this.outputLog(formattedMessage, level);
  }

  /**
   * Format a log entry for output
   */
  private formatLogEntry(entry: LogEntry): string {
    const timestamp = entry.timestamp.toISOString();
    const levelName = LogLevel[entry.level];
    const contextStr = entry.context ? ` | ${JSON.stringify(entry.context)}` : '';
    
    return `[${timestamp}] ${levelName}: ${entry.message}${contextStr}`;
  }

  /**
   * Output the log message (can be overridden for different outputs)
   */
  protected outputLog(message: string, level: LogLevel): void {
    switch (level) {
      case LogLevel.ERROR:
        console.error(message);
        break;
      case LogLevel.WARN:
        console.warn(message);
        break;
      case LogLevel.INFO:
        console.info(message);
        break;
      case LogLevel.DEBUG:
        console.debug(message);
        break;
    }
  }

  /**
   * Get all log entries
   */
  getLogEntries(): LogEntry[] {
    return [...this.entries];
  }

  /**
   * Get log entries by level
   */
  getLogEntriesByLevel(level: LogLevel): LogEntry[] {
    return this.entries.filter(entry => entry.level === level);
  }

  /**
   * Get log entries within a time range
   */
  getLogEntriesInRange(startTime: Date, endTime: Date): LogEntry[] {
    return this.entries.filter(entry => 
      entry.timestamp >= startTime && entry.timestamp <= endTime
    );
  }

  /**
   * Clear all log entries
   */
  clearLogs(): void {
    this.entries = [];
  }

  /**
   * Get log statistics
   */
  getLogStatistics() {
    const total = this.entries.length;
    const byLevel = {
      [LogLevel.DEBUG]: this.getLogEntriesByLevel(LogLevel.DEBUG).length,
      [LogLevel.INFO]: this.getLogEntriesByLevel(LogLevel.INFO).length,
      [LogLevel.WARN]: this.getLogEntriesByLevel(LogLevel.WARN).length,
      [LogLevel.ERROR]: this.getLogEntriesByLevel(LogLevel.ERROR).length
    };

    return {
      total,
      byLevel,
      oldestEntry: this.entries[0]?.timestamp,
      newestEntry: this.entries[this.entries.length - 1]?.timestamp
    };
  }

  /**
   * Export logs to JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.entries, null, 2);
  }

  /**
   * Import logs from JSON
   */
  importLogs(jsonData: string): void {
    try {
      const importedEntries: LogEntry[] = JSON.parse(jsonData);
      this.entries = importedEntries.map(entry => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      }));
    } catch (error) {
      this.error('Failed to import logs', { error: error.message });
    }
  }
}
