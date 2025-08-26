// server/api/products.ts
import { H3Event } from 'h3'
import {Product} from '~~/server/models/product'

export default defineEventHandler(async (event: H3Event) => {
  const method = event.method

  switch (method) {
    case 'GET': {
      return await handleGetProducts(event)
    }

    case 'POST': {
      return await handleCreateProduct(event)
    }

    default:
      throw createError({
        statusCode: 405,
        message: `Method ${method} Not Allowed`
      })
  }
})

// POST - Create a new product
async function handleCreateProduct(event: H3Event) {
  try {
    const body = await readBody(event)
    const files = await readMultipartFormData(event)

    const prodImages = files?.map(file => ({
      location: file.filename,
      size: file.data.length,
      originalname: file.filename
    })) || []

    const product = new Product({
      owner: body.ownerID,
      category: body.categoryID, 
      price: body.price,
      title: body.title,
      description: body.description,
      stockQuantity: body.stockQuantity,
      photo: files?.length ? files[0].filename : '',
      prodImages: files?.length ? prodImages : []
    })

    await product.save()

    return {
      status: true,
      message: 'Product is Successfully saved..',
      prodImages
    }
  } catch (err) {
    throw createError({
      statusCode: 500,
      message: err instanceof Error ? err.message : 'Internal Server Error'
    })
  }
}

// GET - Get all products
async function handleGetProducts(event: H3Event) {
  try {
    const products = await Product.find()
      .populate('owner category')
      .populate('reviews', 'rating')
      .exec()

    return {
      success: true,
      products
    }
  } catch (err) {
    throw createError({
      statusCode: 500,
      message: err instanceof Error ? err.message : 'Internal Server Error'
    })
  }
}
