import mongoose from 'mongoose';

export type UserModel = {
    _id: string,
    name: string,
    mobileNumber: string,
    email: string,
    password: string,
    logoutNum: number,
    numberOfCars: number,
    createdAt: Date,
    carIds: string[],
    address: string
};

const userSchema = new mongoose.Schema({
    name: {type: String},
    mobileNumber: {type: String, unique: true},
    email: {type: String, unique: true},
    password: {type: String},
    logoutNum: Number,
    numberOfCars: Number,
    createdAt: Date,
    carIds: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'cars'
    }],
    address: String
  }, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
