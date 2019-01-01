import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    paymentMethod: String,
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'users'
    },
    amount: Number,
    createdAt: Date,
    status: String
});

const Transaction = mongoose.model('transaction', transactionSchema);
export default Transaction;