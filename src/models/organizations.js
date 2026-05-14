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