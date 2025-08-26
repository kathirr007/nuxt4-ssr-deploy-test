// server/api/products/[id].ts

import { H3Event } from "h3"
import Product from "~~/server/models/product"

export default defineEventHandler(async (event: H3Event) => {
  const method = event.method

  switch (method) {
    case 'GET':
      return await getProduct(event)
    case 'PUT':
      return await updateProduct(event) 
    case 'DELETE':
      return await deleteProduct(event)
    default:
      throw createError({
        statusCode: 405,
        message: 'Method not allowed'
      })
  }
})

// Get single product
async function getProduct(event: H3Event) {
  try {
    const id = getRouterParam(event, 'id')
    const product = await Product.findOne({ _id: id })
      .populate('owner category')
      .populate('reviews', 'rating')
      .exec()

    return {
      success: true,
      product
    }
  } catch (err) {
    throw createError({
      statusCode: 500,
      message: err instanceof Error ? err.message : 'Internal Server Error'
    })
  }
}

// Update a product
async function updateProduct(event: H3Event) {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const files = await readMultipartFormData(event)

    const prodImages = files?.map(file => ({
      location: file.filename,
      size: file.data.length,
      originalname: file.filename
    })) || []

    const updateQuery: any = {
      title: body.title,
      description: body.description,
      price: body.price,
      stockQuantity: body.stockQuantity,
      category: body.categoryID,
      owner: body.ownerID
    }

    if (files?.length) {
      updateQuery.photo = files[0].filename
      updateQuery.prodImages = prodImages
    }

    const product = await Product.findOneAndUpdate(
      { _id: id },
      { $set: updateQuery },
      { upsert: true }
    )

    return {
      success: true,
      updatedProduct: product
    }
  } catch (err) {
    throw createError({
      statusCode: 500,
      message: err instanceof Error ? err.message : 'Internal Server Error'
    })
  }
}

// Delete a product
async function deleteProduct(event: H3Event) {
  try {
    const id = getRouterParam(event, 'id')
    const deletedProduct = await Product.findOneAndDelete({ _id: id })

    if (deletedProduct) {
      return {
        status: true,
        message: "Product is successfully deleted..."
      }
    }
  } catch (err) {
    throw createError({
      statusCode: 500,
      message: err instanceof Error ? err.message : 'Internal Server Error'
    })
  }
}