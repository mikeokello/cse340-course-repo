import { getAllProjects, getProjectById } from '../models/projects.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

export const showProjectsPage = async (req, res, next) => {
    try {
        const allProjects = await getAllProjects();
        const projects = allProjects.slice(0, NUMBER_OF_UPCOMING_PROJECTS);
        res.render('projects', { title: 'Upcoming Service Projects', projects });
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

        res.render('project', { title: 'Project Details', projectDetails });
    } catch (error) {
        next(error);
    }
};