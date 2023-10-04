class Logger {
  static debug(...args: any[]) {
    if (import.meta.env.DEV) {
      console.log.apply(this, args)
    }
  }
  static info(...args: any[]) {
    console.info.apply(this, args)
  }
  static error(...args: any[]) {
    console.error.apply(this, args)
  }
}

export default Logger
export { Logger as Logger }
