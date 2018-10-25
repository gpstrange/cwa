/**
 * Counter
 */
import mongoose from 'mongoose';
import log4js from '../util/log4js';
const logger = log4js.getLogger('COUNTER-MODEL');

export interface CounterSchema extends mongoose.Document {
    categoryName: string;
    value: number;
}

const counterSchema = new mongoose.Schema({
    categoryName: String,
    value: Number
});

const Counter = mongoose.model<CounterSchema>('Counter', counterSchema);
logger.info('counter model created successfully');
export default Counter;
