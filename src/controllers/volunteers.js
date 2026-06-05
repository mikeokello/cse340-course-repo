import { addVolunteer, removeVolunteer, isUserVolunteer, getVolunteerProjects } from '../models/volunteers.js'

export const processAddVolunteer = async (req, res, next) => {
  try {
    const projectId = req.params.id
    const userId = req.session.userId

    // Validate project ID
    if (!/^\d+$/.test(projectId)) {
      const err = new Error('Invalid project ID')
      err.status = 400
      return next(err)
    }

    // Check if user is already a volunteer
    const isVolunteer = await isUserVolunteer(userId, projectId)
    if (isVolunteer) {
      req.session.messages = [{ type: 'info', text: 'You are already volunteering for this project' }]
      return res.redirect(`/project/${projectId}`)
    }

    // Add volunteer
    await addVolunteer(userId, projectId)
    req.session.messages = [{ type: 'success', text: 'You have successfully volunteered for this project!' }]
    res.redirect(`/project/${projectId}`)
  } catch (error) {
    next(error)
  }
}

export const processRemoveVolunteer = async (req, res, next) => {
  try {
    const projectId = req.params.id
    const userId = req.session.userId

    // Validate project ID
    if (!/^\d+$/.test(projectId)) {
      const err = new Error('Invalid project ID')
      err.status = 400
      return next(err)
    }

    // Remove volunteer
    await removeVolunteer(userId, projectId)
    req.session.messages = [{ type: 'success', text: 'You have been removed as a volunteer from this project.' }]
    res.redirect(`/project/${projectId}`)
  } catch (error) {
    next(error)
  }
}

export const processRemoveVolunteerFromDashboard = async (req, res, next) => {
  try {
    const projectId = req.params.id
    const userId = req.session.userId

    // Validate project ID
    if (!/^\d+$/.test(projectId)) {
      const err = new Error('Invalid project ID')
      err.status = 400
      return next(err)
    }

    // Remove volunteer
    await removeVolunteer(userId, projectId)
    req.session.messages = [{ type: 'success', text: 'You have been removed as a volunteer from this project.' }]
    res.redirect('/dashboard')
  } catch (error) {
    next(error)
  }
}
