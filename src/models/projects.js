import { db } from './db.js'

export const getAllProjects = async () => {
  try {
    const query = `
      SELECT 
        sp.project_id,
        sp.title,
        sp.description,
        sp.location,
        o.organization_id,
        o.name as organization_name,
        STRING_AGG(c.name, ', ') as categories
      FROM public.service_project sp
      JOIN public.organization o ON sp.organization_id = o.organization_id
      LEFT JOIN public.project_category pc ON sp.project_id = pc.project_id
      LEFT JOIN public.category c ON pc.category_id = c.category_id
      GROUP BY sp.project_id, o.organization_id, o.name
      ORDER BY sp.title
    `
    const result = await db.query(query)
    return result.rows
  } catch (error) {
    console.error('Error fetching projects:', error.message)
    throw new Error('Failed to fetch projects from database')
  }
}

export const getProjectById = async (projectId) => {
  try {
    const query = `
      SELECT 
        sp.project_id,
        sp.title,
        sp.description,
        sp.location,
        o.organization_id,
        o.name as organization_name,
        o.contact_email,
        STRING_AGG(c.name, ', ') as categories
      FROM public.service_project sp
      JOIN public.organization o ON sp.organization_id = o.organization_id
      LEFT JOIN public.project_category pc ON sp.project_id = pc.project_id
      LEFT JOIN public.category c ON pc.category_id = c.category_id
      WHERE sp.project_id = $1
      GROUP BY sp.project_id, o.organization_id, o.name, o.contact_email
    `
    const result = await db.query(query, [projectId])
    return result.rows[0] || null
  } catch (error) {
    console.error('Error fetching project:', error.message)
    throw new Error('Failed to fetch project from database')
  }
}

export const getProjectsByOrganization = async (organizationId) => {
  try {
    const query = `
      SELECT 
        sp.project_id,
        sp.title,
        sp.description,
        sp.location,
        STRING_AGG(c.name, ', ') as categories
      FROM public.service_project sp
      LEFT JOIN public.project_category pc ON sp.project_id = pc.project_id
      LEFT JOIN public.category c ON pc.category_id = c.category_id
      WHERE sp.organization_id = $1
      GROUP BY sp.project_id
      ORDER BY sp.title
    `
    const result = await db.query(query, [organizationId])
    return result.rows
  } catch (error) {
    console.error('Error fetching projects by organization:', error.message)
    throw new Error('Failed to fetch organization projects from database')
  }
}

export const getProjectsByCategory = async (categoryId) => {
  try {
    const query = `
      SELECT 
        sp.project_id,
        sp.title,
        sp.description,
        sp.location,
        o.name as organization_name,
        STRING_AGG(c.name, ', ') as categories
      FROM public.service_project sp
      JOIN public.organization o ON sp.organization_id = o.organization_id
      JOIN public.project_category pc ON sp.project_id = pc.project_id
      LEFT JOIN public.category c ON pc.category_id = c.category_id
      WHERE pc.category_id = $1
      GROUP BY sp.project_id, o.name
      ORDER BY sp.title
    `
    const result = await db.query(query, [categoryId])
    return result.rows
  } catch (error) {
    console.error('Error fetching projects by category:', error.message)
    throw new Error('Failed to fetch category projects from database')
  }
}
