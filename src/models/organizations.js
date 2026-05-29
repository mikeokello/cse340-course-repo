import { db } from './db.js'

export const getAllOrganizations = async () => {
  try {
    const query = `
      SELECT organization_id, name, description, contact_email, logo_filename
      FROM public.organization
      ORDER BY name
    `
    const result = await db.query(query)
    return result.rows
  } catch (error) {
    console.error('Error fetching organizations:', error.message)
    throw new Error('Failed to fetch organizations from database')
  }
}

export const getOrganizationById = async (organizationId) => {
  try {
    const query = `
      SELECT organization_id, name, description, contact_email, logo_filename
      FROM public.organization
      WHERE organization_id = $1
    `
    const result = await db.query(query, [organizationId])
    return result.rows[0] || null
  } catch (error) {
    console.error('Error fetching organization:', error.message)
    throw new Error('Failed to fetch organization from database')
  }
}
export const createOrganization = async (name, description, contact_email, logo_filename) => {
  try {
    const query = `
      INSERT INTO public.organization (name, description, contact_email, logo_filename)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `
    const result = await db.query(query, [name, description, contact_email, logo_filename])
    return result.rows[0]
  } catch (error) {
    console.error('Error creating organization:', error.message)
    throw new Error('Failed to create organization')
  }
}

export const updateOrganization = async (organizationId, name, description, contact_email, logo_filename) => {
  try {
    const query = `
      UPDATE public.organization
      SET name = $1, description = $2, contact_email = $3, logo_filename = $4
      WHERE organization_id = $5
      RETURNING *
    `
    const result = await db.query(query, [name, description, contact_email, logo_filename, organizationId])
    return result.rows[0] || null
  } catch (error) {
    console.error('Error updating organization:', error.message)
    throw new Error('Failed to update organization')
  }
}