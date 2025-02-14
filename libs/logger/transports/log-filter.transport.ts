import { Transform, TransformOptions, TransformCallback } from 'stream';

export class LogFilterTransport extends Transform {
  private levelMap: Record<number, string>;

  constructor(options: TransformOptions = {}) {
    super({ ...options, objectMode: true });

    this.levelMap = {
      10: 'TRACE',
      20: 'DEBUG',
      30: 'INFO',
      40: 'WARN',
      50: 'ERROR',
      60: 'FATAL',
    };
  }

  _transform(
    chunk: unknown,
    encoding: BufferEncoding,
    callback: TransformCallback,
  ): void {
    try {
      // Parse the log entry if it's a string
      const logEntry = typeof chunk === 'string' ? JSON.parse(chunk) : chunk;

      // Extract only the required fields
      const { level, msg, err, context } = logEntry;

      const levelString = this.levelMap[level] || 'UNKNOWN';

      // Reconstruct the filtered log entry
      const filteredLog = {
        level: levelString,
        msg: msg,
        err: err,
        context: context || 'LogFilterTransport',
      };

      // Push the filtered log as a JSON string
      process.stdout.write(JSON.stringify(filteredLog) + '\n');
      callback();
    } catch (error) {
      console.error('Error processing log entry:', error);
      callback();
    }
  }
}
