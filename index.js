const fs = require("fs")
const path = require("path")
const chalk = require("chalk")

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
}

const levelColors = {
  error: "red",
  warn: "yellow",
  info: "green",
  debug: "blue",
}

const levelEmojis = {
  error: "❌",
  warn: "⚠️",
  info: "✅",
  debug: "🐛",
}

class SimpleLogger {
  constructor(options = {}) {
    this.logLevel = options.logLevel || "info"
    this.logFile = options.logFile || null
    this.logFormat =
      options.logFormat || "[{level}] [{timestamp}] - {message} - {emoji}"
    this.dateFormat = options.dateFormat || "yyyy-mm-dd HH:MM:ss"
    this.maxFileSize = options.maxFileSize || 1024 * 1024 * 10 // 10MB
    this.maxFiles = options.maxFiles || 5
  }

  log(level, message) {
    if (logLevels[level] <= logLevels[this.logLevel]) {
      const timestamp = this.formatDate(new Date())
      const logMessage = this.formatMessage(timestamp, level, message)

      console.log(logMessage)

      if (this.logFile) {
        this.writeToFile(logMessage)
      }
    }
  }

  formatDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    const seconds = String(date.getSeconds()).padStart(2, "0")

    return this.dateFormat
      .replace("yyyy", year)
      .replace("mm", month)
      .replace("dd", day)
      .replace("HH", hours)
      .replace("MM", minutes)
      .replace("ss", seconds)
  }

  formatMessage(timestamp, level, message) {
    const levelColor = levelColors[level] || "white"
    const levelEmoji = levelEmojis[level] || ""

    const formattedMessage = this.logFormat
      .replace("{timestamp}", chalk.magenta(timestamp))
      .replace("{level}", chalk[levelColor](level.toUpperCase()))
      .replace("{message}", message)
      .replace("{emoji}", levelEmoji)

    return formattedMessage
  }

  writeToFile(logMessage) {
    const fileSize = fs.existsSync(this.logFile)
      ? fs.statSync(this.logFile).size
      : 0

    if (fileSize >= this.maxFileSize) {
      this.rotateLogFile()
    }

    fs.appendFileSync(this.logFile, logMessage + "\n")
  }
  rotateLogFile() {
    const extension = path.extname(this.logFile)
    const baseName = path.basename(this.logFile, extension)
    const dirName = path.dirname(this.logFile)

    // Correcting the deletion and rotation logic
    const oldestFile = path.join(
      dirName,
      `${baseName}.${this.maxFiles}${extension}`
    )
    if (fs.existsSync(oldestFile)) {
      fs.unlinkSync(oldestFile)
    }

    for (let i = this.maxFiles - 1; i > 0; i--) {
      const currentFile = path.join(dirName, `${baseName}.${i}${extension}`)
      const newFile = path.join(dirName, `${baseName}.${i + 1}${extension}`)
      if (fs.existsSync(currentFile)) {
        fs.renameSync(currentFile, newFile)
      }
    }

    const newFirstFile = path.join(dirName, `${baseName}.1${extension}`)
    if (fs.existsSync(this.logFile)) {
      fs.renameSync(this.logFile, newFirstFile)
    }
  }

  error(message) {
    this.log("error", message)
  }

  warn(message) {
    this.log("warn", message)
  }

  info(message) {
    this.log("info", message)
  }

  debug(message) {
    this.log("debug", message)
  }
}

module.exports = SimpleLogger
