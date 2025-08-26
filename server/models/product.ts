import mongoose, { Schema, Document } from 'mongoose'
// @ts-ignore
import mongooseAlgolia from 'mongoose-algolia'
import Category from './category'
import Owner from './owner'
import Review from './review'

interface IProduct extends Document {
  category: Schema.Types.ObjectId
  owner: Schema.Types.ObjectId
  title: string
  description: string
  photo: string
  prodImages: any[]
  price: number
  stockQuantity: number
  reviews: Schema.Types.ObjectId[]
  averageRating: number
}

const ProductSchema = new Schema({
    category: { type: Schema.Types.ObjectId, ref: 'Category'},
    owner: { type: Schema.Types.ObjectId, ref: 'Owner'},
    title: String,
    description: String,
    photo: String,
    prodImages: Array,
    price: Number,
    stockQuantity: Number,
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }]
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})

ProductSchema.virtual('averageRating').get(function(this: IProduct): number {
    if(this.reviews.length > 0) {
        let sum = this.reviews.reduce((total: number, review: any): number => {
            return total + review.rating
        }, 0)
        return sum / this.reviews.length
    }
    return 0
})

ProductSchema.plugin(mongooseAlgolia, {
    appId: process.env.ALGOLIA_APP_ID,
    apiKey: process.env.ALGOLIA_SECRET,
    indexName: process.env.ALGOLIA_INDEX,

    selector: 'title _id photo description price rating averageRating owner category',
    populate: {
        path: 'owner reviews category',
    },
    debug: true
})

interface ProductModel extends mongoose.Model<IProduct> {
    SyncToAlgolia(): void
    SetAlgoliaSettings(settings: object): void
}

const Product = mongoose.model<IProduct, ProductModel>('Product', ProductSchema)
Product.SyncToAlgolia()
Product.SetAlgoliaSettings({
    searchableAttributes: ['title', 'category', 'averageRating', 'price']
})

export default Product

export { IProduct, Product, ProductSchema }