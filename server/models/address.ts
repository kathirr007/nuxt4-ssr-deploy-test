import mongoose, { Document } from 'mongoose';
const { Schema } = mongoose;
import User from '~~/server/models/user'

interface IAddress extends Document {
  user: mongoose.Types.ObjectId;
  country: string;
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  deliveryInstructions?: string;
  securityCode?: string;
}

const AddressSchema = new Schema<IAddress>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  country: String,
  fullName: String,
  streetAddress: String,
  city: String,
  state: String,
  zipCode: String,
  phoneNumber: String,
  deliveryInstructions: String,
  securityCode: String,
});

const Address = mongoose.model<IAddress>('Address', AddressSchema);

export default Address;
export { IAddress };