import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    serviceType: String,
    serviceId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'services'
    },
    userId:  {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'users'
    },
    vendorId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'vendors'
    },
    transactionId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'transactions'
    },
    amount: Number,
    carId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'cars'
    },
    createdAt: Date
});

const Booking = mongoose.model('booking', bookingSchema);
export default Booking;
