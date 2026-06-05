import { getAllProjects, getProjectById, createProject, updateProject } from '../models/projects.js';
import { getAllOrganizations } from '../models/organizations.js';
import { isUserVolunteer } from '../models/volunteers.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

export const showProjectsPage = async (req, res, next) => {
    try {
        const allProjects = await getAllProjects();
        const projects = allProjects.slice(0, NUMBER_OF_UPCOMING_PROJECTS);
        res.render('projects', {
            title: 'Upcoming Service Projects',
            projects,
            messages: req.session.messages || []
        });
        req.session.messages = [];
    } catch (error) {
        next(error);
    }
};

export const showProjectDetailsPage = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        if (!/^\d+$/.test(projectId)) {
            const err = new Error('Invalid project ID');
            err.status = 400;
            return next(err);
        }
        const projectDetails = await getProjectById(projectId);
        if (!projectDetails) {
            const err = new Error('Project not found');
            err.status = 404;
            return next(err);
        }

        // Check if user is logged in and is a volunteer
        let isVolunteer = false;
        if (req.session.userId) {
            isVolunteer = await isUserVolunteer(req.session.userId, projectId);
        }

        res.render('project', {
            title: 'Project Details',
            projectDetails,
            isVolunteer,
            messages: req.session.messages || []
        });
        req.session.messages = [];
    } catch (error) {
        next(error);
    }
};

// NEW: Create
export const showCreateProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    res.render('project-form', {
        title: 'Create New Service Project',
        formData: {},
        organizations,
        errors: [],
        action: '/new-project',
        submitText: 'Create Project'
    });
};

export const processCreateProject = async (req, res, next) => {
    try {
        const { organization_id, title, description, location } = req.body;
        const errors = validateProject(organization_id, title, description, location);

        if (errors.length > 0) {
            const organizations = await getAllOrganizations();
            return res.render('project-form', {
                title: 'Create New Service Project',
                formData: req.body,
                organizations,
                errors,
                action: '/new-project',
                submitText: 'Create Project'
            });
        }

        await createProject(organization_id, title, description, location);
        req.session.messages = [{ type: 'success', text: 'Project created successfully!' }];
        res.redirect('/projects');
    } catch (error) {
        next(error);
    }
};

// NEW: Edit
export const showEditProjectForm = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectById(projectId);
        if (!project) {
            const err = new Error('Project not found');
            err.status = 404;
            return next(err);
        }
        const organizations = await getAllOrganizations();
        res.render('project-form', {
            title: 'Edit Service Project',
            formData: project,
            organizations,
            errors: [],
            action: `/edit-project/${projectId}`,
            submitText: 'Update Project'
        });
    } catch (error) {
        next(error);
    }
};

export const processEditProject = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const { organization_id, title, description, location } = req.body;
        const errors = validateProject(organization_id, title, description, location, 3);

        if (errors.length > 0) {
            const organizations = await getAllOrganizations();
            return res.render('project-form', {
                title: 'Edit Service Project',
                formData: { project_id: projectId,...req.body },
                organizations,
                errors,
                action: `/edit-project/${projectId}`,
                submitText: 'Update Project'
            });
        }

        const updated = await updateProject(projectId, organization_id, title, description, location);
        if (!updated) {
            const err = new Error('Project not found');
            err.status = 404;
            return next(err);
        }

        req.session.messages = [{ type: 'success', text: 'Project updated successfully!' }];
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        next(error);
    }
};

const validateProject = (orgId, title, description, location, minLength = 0) => {
    const errors = [];
    if (!orgId) errors.push('Organization is required');
    if (!title || title.trim() === '') errors.push('Title is required');
    if (title && title.trim().length > 200) errors.push('Title must be 200 characters or less');
    if (title && title.trim().length < minLength) errors.push(`Title must be at least ${minLength} characters`);
    if (!description || description.trim() === '') errors.push('Description is required');
    return errors;
};