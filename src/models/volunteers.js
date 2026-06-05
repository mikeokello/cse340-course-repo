import { db } from './db.js'

export const addVolunteer = async (userId, projectId) => {
  try {
    const query = `
      INSERT INTO public.project_volunteer (user_id, project_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, project_id) DO NOTHING
      RETURNING user_id, project_id, volunteered_date
    `
    const result = await db.query(query, [userId, projectId])
    return result.rows.length > 0 ? result.rows[0] : null
  } catch (error) {
    console.error('Error adding volunteer:', error.message)
    throw new Error('Failed to add volunteer to project')
  }
}

export const removeVolunteer = async (userId, projectId) => {
  try {
    const query = `
      DELETE FROM public.project_volunteer
      WHERE user_id = $1 AND project_id = $2
      RETURNING user_id, project_id
    `
    const result = await db.query(query, [userId, projectId])
    return result.rows.length > 0 ? result.rows[0] : null
  } catch (error) {
    console.error('Error removing volunteer:', error.message)
    throw new Error('Failed to remove volunteer from project')
  }
}

export const isUserVolunteer = async (userId, projectId) => {
  try {
    const query = `
      SELECT user_id
      FROM public.project_volunteer
      WHERE user_id = $1 AND project_id = $2
    `
    const result = await db.query(query, [userId, projectId])
    return result.rows.length > 0
  } catch (error) {
    console.error('Error checking volunteer status:', error.message)
    throw new Error('Failed to check volunteer status')
  }
}

export const getVolunteerProjects = async (userId) => {
  try {
    const query = `
      SELECT 
        sp.project_id,
        sp.title,
        sp.description,
        sp.location,
        o.organization_id,
        o.name as organization_name,
        pv.volunteered_date
      FROM public.project_volunteer pv
      JOIN public.service_project sp ON pv.project_id = sp.project_id
      JOIN public.organization o ON sp.organization_id = o.organization_id
      WHERE pv.user_id = $1
      ORDER BY sp.title
    `
    const result = await db.query(query, [userId])
    return result.rows
  } catch (error) {
    console.error('Error fetching volunteer projects:', error.message)
    throw new Error('Failed to fetch volunteer projects')
  }
}

export const getProjectVolunteerCount = async (projectId) => {
  try {
    const query = `
      SELECT COUNT(*) as volunteer_count
      FROM public.project_volunteer
      WHERE project_id = $1
    `
    const result = await db.query(query, [projectId])
    return result.rows[0].volunteer_count
  } catch (error) {
    console.error('Error fetching volunteer count:', error.message)
    throw new Error('Failed to fetch volunteer count')
  }
}
