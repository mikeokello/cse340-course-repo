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

// NEW FOR WEEK 4
export const createCategory = async (name) => {
  try {
    const query = `
      INSERT INTO public.category (name)
      VALUES ($1)
      RETURNING category_id, name
    `
    const result = await db.query(query, [name])
    return result.rows[0]
  } catch (error) {
    console.error('Error creating category:', error.message)
    throw new Error('Failed to create category in database')
  }
}

export const updateCategory = async (categoryId, name) => {
  try {
    const query = `
      UPDATE public.category
      SET name = $1
      WHERE category_id = $2
      RETURNING category_id, name
    `
    const result = await db.query(query, [name, categoryId])
    return result.rows[0] || null
  } catch (error) {
    console.error('Error updating category:', error.message)
    throw new Error('Failed to update category in database')
  }
}

export const getCategoriesForProject = async (projectId) => {
  try {
    const query = `
      SELECT c.category_id, c.name
      FROM public.category c
      JOIN public.project_category pc ON c.category_id = pc.category_id
      WHERE pc.project_id = $1
      ORDER BY c.name
    `
    const result = await db.query(query, [projectId])
    return result.rows
  } catch (error) {
    console.error('Error fetching project categories:', error.message)
    throw new Error('Failed to fetch project categories')
  }
}

export const updateProjectCategories = async (projectId, categoryIds) => {
  const client = await db.pool.connect()
  try {
    await client.query('BEGIN')

    // Delete existing
    await client.query('DELETE FROM public.project_category WHERE project_id = $1', [projectId])

    // Insert new
    if (categoryIds && categoryIds.length > 0) {
      const values = categoryIds.map((catId, i) => `($1, $${i + 2})`).join(',')
      await client.query(
        `INSERT INTO public.project_category (project_id, category_id) VALUES ${values}`,
        [projectId,...categoryIds]
      )
    }

    await client.query('COMMIT')
    return true
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error updating project categories:', error.message)
    throw new Error('Failed to update project categories')
  } finally {
    client.release()
  }
}