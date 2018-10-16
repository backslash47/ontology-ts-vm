export class TracedError extends Error {
  cause: Error | undefined;
  constructor(msg?: string | Error, cause?: Error) {
    if (msg instanceof Error) {
      cause = msg;
      msg = undefined;
    }

    super(msg);

    this.cause = cause;

    const oldStackTrace = Error.prepareStackTrace;
    try {
      Error.prepareStackTrace = (err, structuredStackTrace) => {
        const current = oldStackTrace !== undefined ? oldStackTrace(err, structuredStackTrace) : '';

        if (this.cause !== undefined) {
          return current + this.cause.stack;
        }

        return current;
      };

      if (Error.captureStackTrace !== undefined) {
        Error.captureStackTrace(this, TracedError);
      }

      // tslint:disable-next-line:no-unused-expression
      this.stack; // Invoke the getter for `stack`.
    } finally {
      Error.prepareStackTrace = oldStackTrace;
    }
  }

  toString() {
    let text = this.message + '\n';

    if (this.cause !== undefined) {
      text += this.cause.toString();
    }

    return text;
  }
}
