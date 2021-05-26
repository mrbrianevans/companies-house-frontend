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
}
export class Timer {
  private readonly startTime: number
  private finishTime: number
  private mostRecentlyStartedLabel: string
  private config?: Config
  private readonly savedTimes: { [label: string]: { startTime: number; finishTime?: number; time?: number } }
  /**
   * Create a new Timer object. Can have multiple timers within this object.
   * Should only have one of these per file
   * @param config optional configuration object with message and severity
   */
  constructor(config?: Config) {
    this.startTime = Date.now()
    this.config = config
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
      this.stop(label)
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

  /**
   * stops the most recently started timer
   */
  public end() {
    if (this.mostRecentlyStartedLabel) this.stop(this.mostRecentlyStartedLabel)
  }
  /**
   * prints times to the console in JSON format for Google Cloud Logging
   *
   * Will end the most recently started timer if not already ended
   */
  public flush() {
    this.finishTime = Date.now()
    if (this.mostRecentlyStartedLabel && !this.savedTimes[this.mostRecentlyStartedLabel].finishTime) this.end()
    const printObject: { [label: string]: string | number } = {
      severity: this.config?.severity ?? 'INFO',
      message: (this.config?.label ?? `Timer`) + `: ${this.finishTime - this.startTime}ms`
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
}

//todo: idea for improvement:
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
