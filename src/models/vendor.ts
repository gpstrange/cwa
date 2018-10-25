import mongoose from 'mongoose';
import { ServiceList, serviceList } from './service-list';

export const locationSchema = new mongoose.Schema({
    type: {type: String, default: 'Point'},
    coordinates: {type: Array}
});

export type locationType = {
    coordinates: Array<number>,
    type: string
};

export interface VendorInterface extends mongoose.Document {
    _id: string;
    id: string;
    name: string;
    mobileNumber1: number;
    mobileNumber2: number;
    email: string;
    password: string;
    logoutNum: number;
    createdAt: Date;
    address: string;
    ownerName: string;
    workingFromHour: number;
    workingFromMinute: number;
    workingToHour: number;
    workingToMinute: number;
    servicesOffered: ServiceList[];
    pickupFacility: boolean;
    location: locationType;
    images: string[];
    city: string;
}

const vendorSchema = new mongoose.Schema({
    id: String,
    name: {type: String, required: true},
    mobileNumber1: {type: Number, unique: true},
    mobileNumber2: {type: Number},
    email: {type: String, unique: true},
    password: {type: String},
    logoutNum: Number,
    createdAt: Date,
    address: String,
    ownerName: {type: String},
    workingFromHour: Number,
    workingFromMinute: Number,
    workingToHour: Number,
    workingToMinute: Number,
    servicesOffered: [serviceList],
    pickupFacility: Boolean,
    location: locationSchema,
    images: Array,
    city: String
  }, { timestamps: true });

  vendorSchema.index({location: '2dsphere'});

  vendorSchema.pre('save', function(next) {
    const self = <VendorInterface>this;
      if (!self.location ||
        self.location.coordinates === undefined ||
        self.location.coordinates.length === 0 ||
        !self.location.coordinates[1]) {
        self.location = undefined;
      }
      return next();
    });
  

const Vendor = mongoose.model('vendor', vendorSchema);
export default Vendor;
