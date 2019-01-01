import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
    modelName: String,
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'users'
    },
    registrationNumber: String
});

const Car = mongoose.model('car', carSchema);
export default Car;
