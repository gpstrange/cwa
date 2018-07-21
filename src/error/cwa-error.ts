/**
 * HAMS Error
 */

// Defining Error type
export type ErrorObj = {
    message: string;
    code: number;
    status: number;
};

// Creating an error class
export default class CWAError extends Error {
    message: string;
    errCode: number;
    statusCode: number;
    constructor(err: ErrorObj) {
        super(err.message);
        this.message = err.message;
        this.errCode = err.code;
        this.statusCode = err.status;
    }
}
