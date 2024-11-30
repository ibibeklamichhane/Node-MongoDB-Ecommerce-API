class ApiError extends Error {
    statusCode       = 0;
 additionalMessage = null;

    constructor (statusCode, message, stack, additionalMessage) {
        super(message);
        this.statusCode        = statusCode;
        this.additionalMessage = additionalMessage;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;
