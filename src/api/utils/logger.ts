/**
 * Comprehensive logging utility for API test automation
 * Provides structured logging with different levels: DEBUG, INFO, WARN, ERROR
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error;
}

export const mask = (value: string) =>
  value.length <= 2 ? '***' : value[0] + '***' + value[value.length - 1];

class Logger {
  private logLevel: LogLevel = LogLevel.DEBUG;
  private logs: LogEntry[] = [];

  constructor(logLevel?: LogLevel) {
    if (logLevel) {
      this.logLevel = logLevel;
    }
  }

  /**
   * Set the minimum log level
   */
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  /**
   * Log a debug message
   */
  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Log an info message
   */
  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Log an error message with optional error object
   */
  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  /**
   * Internal logging method
   */
  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): void {
    // Check if this log level should be logged based on current log level setting
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(context && { context }),
      ...(error && { error }),
    };

    this.logs.push(entry);
    this.printLog(entry);
  }

  /**
   * Determine if a log level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    const levelOrder: Record<LogLevel, number> = {
      [LogLevel.DEBUG]: 0,
      [LogLevel.INFO]: 1,
      [LogLevel.WARN]: 2,
      [LogLevel.ERROR]: 3,
    };

    return levelOrder[level] >= levelOrder[this.logLevel];
  }

  /**
   * Print log entry to console with formatting
   */
  private printLog(entry: LogEntry): void {
    const { timestamp, level, message, context, error } = entry;
    const prefix = `[${timestamp}] [${level}]`;

    const logMessage = context
      ? `${prefix} ${message} ${JSON.stringify(context, null, 2)}`
      : `${prefix} ${message}`;

    switch (level) {
      case LogLevel.DEBUG:
        console.log(`\x1b[36m${logMessage}\x1b[0m`); // Cyan
        break;
      case LogLevel.INFO:
        console.log(`\x1b[32m${logMessage}\x1b[0m`); // Green
        break;
      case LogLevel.WARN:
        console.log(`\x1b[33m${logMessage}\x1b[0m`); // Yellow
        break;
      case LogLevel.ERROR:
        console.error(`\x1b[31m${logMessage}\x1b[0m`); // Red
        if (error) {
          console.error(`\x1b[31m${error.stack}\x1b[0m`);
        }
        break;
    }
  }

  /**
   * Get all collected logs
   */
  getLogs(): LogEntry[] {
    return this.logs;
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Export logs as JSON
   */
  exportLogsAsJSON(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Export logs as formatted text
   */
  exportLogsAsText(): string {
    return this.logs
      .map(
        (entry) =>
          `[${entry.timestamp}] [${entry.level}] ${entry.message}${
            entry.context ? ` ${JSON.stringify(entry.context)}` : ''
          }`
      )
      .join('\n');
  }
}

// Create and export a singleton logger instance
export const logger = new Logger();

export default Logger;
