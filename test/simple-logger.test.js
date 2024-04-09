const fs = require("fs")
const path = require("path")
const SimpleLogger = require("../index")

describe("SimpleLogger", () => {
  let logger
  const logFileNmae = "test"
  const logFile = `${logFileNmae}.log`

  beforeEach(() => {
    logger = new SimpleLogger({
      logLevel: "debug",
      logFile: logFile,
      logFormat: "[{level}] [{timestamp}] - {message} - {emoji}",
      dateFormat: "yyyy/mm/dd HH:MM:ss",
      maxFileSize: 100,
      maxFiles: 3,
    })
  })

  afterEach(() => {
    // Clean up log files
    for (let i = 1; i <= 3; i++) {
      const file = `${logFileNmae}.${i}.log`
      if (fs.existsSync(file)) {
        fs.unlinkSync(file)
      }
    }
    if (fs.existsSync(logFile)) {
      fs.unlinkSync(logFile)
    }
    // Reset jest spies
    jest.restoreAllMocks()
  })

  test("logs messages to console and file", () => {
    const consoleLogSpy = jest.spyOn(console, "log")

    logger.info("info log")
    logger.warn("warn log")
    logger.error("error log")
    logger.debug("debug log")

    expect(consoleLogSpy).toHaveBeenCalledTimes(4)
    expect(fs.existsSync(logFile)).toBe(true)
  })

  test("filters logs based on log level", () => {
    logger.logLevel = "warn"
    const consoleLogSpy = jest.spyOn(console, "log")

    logger.info("info log")
    logger.warn("warn log")
    logger.error("error log")
    logger.debug("debug log")

    expect(consoleLogSpy).toHaveBeenCalledTimes(2)
  })

  test("rotates log files when max file size is reached", () => {
    // Write logs exceeding the max file size
    for (let i = 0; i < 15; i++) {
      logger.info(`log message ${i}`)
    }

    expect(fs.existsSync(`${logFileNmae}.1.log`)).toBe(true)
    expect(fs.existsSync(`${logFileNmae}.2.log`)).toBe(true)
    expect(fs.existsSync(`${logFileNmae}.3.log`)).toBe(true)
    expect(fs.existsSync(`${logFileNmae}.4.log`)).toBe(false)
  })

  test("removes oldest log file when max files is reached", () => {
    // Write logs exceeding the max files
    for (let i = 0; i < 45; i++) {
      logger.info(`log message ${i}`)
    }

    expect(fs.existsSync(`${logFileNmae}.1.log`)).toBe(true)
    expect(fs.existsSync(`${logFileNmae}.2.log`)).toBe(true)
    expect(fs.existsSync(`${logFileNmae}.3.log`)).toBe(true)
    expect(fs.existsSync(`${logFileNmae}.4.log`)).toBe(false)
  })
})
