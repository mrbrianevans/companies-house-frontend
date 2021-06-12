//todo:
// - add the option of adding metadata to the log after its been started (details setter)
// - make 'class' a built-in, required param in the constructor (force)
// - add error handling methods, such as handlePostgresError(e)
// this should really be in every single interface method, from the top to the return

type Config = {
  /**
   * the severity of the log, changes the way its printed in google cloud logging
   */
  severity?: 'INFO' | 'ERROR' | 'DEBUG' | 'NOTICE'
  /**
   * the label of the log. gets printed in the google cloud summary message
   */
  label?: string
  /**
   * any key-value pairs to include in the console log
   */
  details?: { [key: string]: string | number }
  // filename of the typescript source file where the log is coming from. Soon to become mandatory
  filename: string
}
export class Timer {
  private readonly startTime: number
  private finishTime: number
  private mostRecentlyStartedLabel: string
  private config: Config
  private readonly savedTimes: { [label: string]: { startTime: number; finishTime?: number; time?: number } }
  /**
   * Create a new Timer object. Can have multiple timers within this object.
   * Should only have one of these per file
   * @param config optional configuration object with message and severity
   */
  constructor(config: Config) {
    this.startTime = Date.now()
    this.config = config
    this.config.details = config?.details ?? {}
    // TODO: split filename by '/' and save each item as its own key:value in the log.
    //  - such as ./interface/getCompanyProfile.ts becomes {level1:'interface', level2:'getCompanyProfile.ts'}
    this.savedTimes = {}
    if (this.config?.label !== undefined) this.start(this.config.label)
  }

  /**
   * Start a new timer
   * @param label the label of the timer. this will be console logged on flush()
   * @return object which can be used to stop the timer without its label
   */
  public start(label: string) {
    console.assert(!this.savedTimes.hasOwnProperty(label), 'Timer started more than once for same label')
    console.assert(label !== 'message', 'Label cannot be called message. Reserved by default')
    console.assert(label !== 'severity', 'Label cannot be called severity. Reserved by default')
    this.mostRecentlyStartedLabel = label
    this.savedTimes[label] = { startTime: Date.now() }
    /**
     * Stops the timer and saves the time taken
     */
    const _stop = () => {
      return this.stop(label)
    }
    return {
      stop: _stop
    }
  }

  /**
   * Stops a timer and saves the time taken
   * @param label the label of the timer you wish to stop
   */
  public stop(label: string) {
    console.assert(this.savedTimes.hasOwnProperty(label), 'Timer stopped for unstarted label. Missing timer.start()')
    console.assert(this.savedTimes[label].finishTime === undefined, 'Stop called more than once for same label')
    this.savedTimes[label].finishTime = Date.now()
    this.savedTimes[label].time = this.savedTimes[label].finishTime - this.savedTimes[label].startTime
    return this.savedTimes[label].time
  }

  /**
   * Stops the most recently started timer, and starts a new one
   * @param label for new timer started
   * @example
   * timer.start('label1')
   * await new Promise()
   * timer.next('label2')
   * await new Promise()
   * timer.next('label3')
   * await new Promise()
   * timer.end()
   */
  public next(label: string) {
    this.stop(this.mostRecentlyStartedLabel)
    this.start(label)
  }
  //idea for improvement: [IMPLEMENTED]
  // it would be great to not have to have 2 method calls right after each other
  // this would only work if there were not overlapping timers
  // for example:
  // timer.start('label1')
  // [logic]
  // timer.next('label2')
  // [logic]
  // timer.next('label3')
  // [logic]
  // timer.stop()

  /**
   * stops the most recently started timer
   */
  public end() {
    if (this.mostRecentlyStartedLabel) return this.stop(this.mostRecentlyStartedLabel)
  }
  /**
   * prints times to the console in JSON format for Google Cloud Logging.
   *
   * Will end the most recently started timer if not already ended
   */
  public flush() {
    this.finishTime = Date.now()
    if (this.mostRecentlyStartedLabel && !this.savedTimes[this.mostRecentlyStartedLabel].finishTime) this.end()
    const printObject: { [label: string]: string | number } = {
      severity: this.config?.severity ?? 'INFO',
      message: (this.config?.label ?? `Timer`) + `: ${this.finishTime - this.startTime}ms`,
      filename: this.config?.filename
    }
    Object.entries(this.savedTimes).forEach(([label, times]) => {
      printObject[label] = times.time
    })
    if (this?.config?.details)
      Object.entries(this.config.details).forEach(([label, detail]) => {
        printObject[label] = detail
      })
    console.log(JSON.stringify(printObject))
    return this.finishTime - this.startTime
  }

  /**
   * Adds a detail to the JSON of the log.
   *
   * @param key the key to log in the JSON
   * @param value (optional) value for the key. Defaults to true
   */
  public addDetail(key: string, value: string | number | boolean = true) {
    Object.assign(this.config?.details, { [key]: value })
  }

  /**
   * Adds multiple details to the JSON of the log.
   *
   * @param details an object of key value pairs to log
   */
  public addDetails(details: { [key: string]: string | number | boolean }) {
    Object.assign(this.config?.details, details)
  }

  /**
   * Returns the time elapsed since creating this timer in milliseconds
   */
  public getTimeUntilNow() {
    return Date.now() - this.startTime
  }
  /**
   * Logs a custom error message in a separate log to the main Timer
   * @param message the string to log
   */
  public customError(message: string) {
    const errorLog = {
      severity: 'ERROR',
      message: message,
      filename: this.config?.filename
    }
    console.log(JSON.stringify(errorLog))
  }

  /**
   * Logs a postgres error message in a separate log to the main Timer.
   *
   * @param e the error object returned by postgres client
   *
   * @example
   * const { rows } = await pool.query('SELECT NOW()',[])
   *                            .catch(e=>timer.postgresError(e))
   */
  public postgresError(e: PostgresError): void {
    const errorLog = {
      severity: 'ERROR',
      message: 'Postgres Error: ' + e.message,
      errno: e.errno,
      code: e.code,
      filename: this?.config?.filename,
      characterPositionInQuery: e.position
    }
    console.log(JSON.stringify(errorLog))
  }

  /**
   * Logs a generic error in a separate log to the main Timer.
   *
   * @param e the error that has been thrown
   * @param message an optional custom message giving context to the error
   * This can be called after any catching any error, like this:
   * @example
   * try{
   *   // code that could throw an error
   * }catch(e){
   *   timer.genericError(e)
   * }
   * @example
   * await asynchronousFunction()
   *        .then()
   *        .catch(timer.genericError)
   */
  public genericError(e: Error, message?: string) {
    const errorLog = {
      severity: 'ERROR',
      message,
      errorMessage: e.message,
      errorName: e.name,
      stackTrace: e.stack,
      filename: this.config?.filename
    }
    console.log(JSON.stringify(errorLog))
  }
}

type PostgresError = {
  message: string
  errno: string
  length: number
  name: string
  severity: string
  code: string
  detail?: string
  hint?: string
  position: string
  internalPosition?: string
  internalQuery?: string
  where?: string
  schema?: string
  table?: string
  column?: string
  dataType?: string
  constraint?: string
  file: string
  line: string
  routine: string
}
