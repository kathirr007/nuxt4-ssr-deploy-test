import mongoose, { Document, Schema } from 'mongoose';

interface ICategory extends Document {
  type: string;
}

const CategorySchema = new Schema({
  type: { type: String, unique: true, required: true }
});

const Category = mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
export { ICategory, Category, CategorySchema };