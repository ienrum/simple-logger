import SimpleLogger from "./index.js"

const logger = new SimpleLogger({
  logLevel: "debug",
  logFile: "app.log",
  logFormat: "[{level}] [{timestamp}] - {message} - {emoji}",
  dateFormat: "yyyy-mm-dd HH:MM:ss",
  maxFileSize: 1024 * 1024 * 5, // 5MB
  maxFiles: 3,
})

logger.info("This is an informational message")
logger.warn("This is a warning message")
logger.error("This is an error message")
logger.debug("This is a debug message")
