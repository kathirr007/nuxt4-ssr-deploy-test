import mongoose, { Document, Schema } from 'mongoose';
import Product from '~~/server/models/product';
import User from '~~/server/models/user';

interface IReview extends Document {
  headline: string;
  body: string;
  rating: number;
  photo: string;
  productID: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
}

const ReviewSchema = new Schema<IReview>({
  headline: String,
  body: String,
  rating: Number,
  photo: String,
  productID: { type: Schema.Types.ObjectId, ref: 'Product' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

const Review = mongoose.model<IReview>('Review', ReviewSchema);

export default Review;

export { IReview, Review, ReviewSchema }