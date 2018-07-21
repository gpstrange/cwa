/**
 * HTTP Codes
 */
import { STATUS_CODES as httpStatus } from 'http';

const statusCodes = Object.keys(httpStatus); // Returns an array of keys

interface HttpStatus {
    [key: string]: number;
}

const http_status: HttpStatus = {};

// Maping the keys and changes keys to value and value to key
statusCodes.forEach((code) => {
    const key = httpStatus[code].replace(/\s/g, '_').toUpperCase();
    http_status[key] = +code;
});

export default http_status;
