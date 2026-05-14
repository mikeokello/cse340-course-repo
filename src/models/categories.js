import { db } from './db.js'

export const getAllCategories = async () => {
  try {
    const query = `
      SELECT category_id, name
      FROM public.category
      ORDER BY name
    `
    const result = await db.query(query)
    return result.rows
  } catch (error) {
    console.error('Error fetching categories:', error.message)
    throw new Error('Failed to fetch categories from database')
  }
}

export const getCategoryById = async (categoryId) => {
  try {
    const query = `
      SELECT category_id, name
      FROM public.category
      WHERE category_id = $1
    `
    const result = await db.query(query, [categoryId])
    return result.rows[0] || null
  } catch (error) {
    console.error('Error fetching category:', error.message)
    throw new Error('Failed to fetch category from database')
  }
}