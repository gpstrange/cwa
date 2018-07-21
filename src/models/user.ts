import mongoose from 'mongoose';

export type UserModel = {
    _id: string,
    name: string,
    mobileNumber: string,
    email: string,
    password: string,
    logoutNum: number,
    securityLevel: number
};

const userSchema = new mongoose.Schema({
    name: {type: String},
    mobileNumber: {type: String, unique: true},
    email: {type: String, unique: true},
    password: {type: String},
    logoutNum: {type: Number},
    securityLevel: {type: Number}
  }, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
