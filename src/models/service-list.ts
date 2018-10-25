import mongoose from 'mongoose';

export type ServiceList = {
    name: string,
    estimatedTime: string
};

export const serviceList = new mongoose.Schema({
    name: String,
    estimatedTime: {type: Number}
});

const Services = mongoose.model('services', serviceList);
export default Services;
