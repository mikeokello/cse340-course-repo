import { getAllOrganizations, getOrganizationById } from '../models/organizations.js';
import { getProjectsByOrganization } from '../models/projects.js';

export const showOrganizationsPage = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();
        res.render('organizations', { title: 'Our Partner Organizations', organizations });
    } catch (error) {
        next(error);
    }
};

export const showOrganizationDetailsPage = async (req, res, next) => {
    try {
        const organizationId = req.params.id;

        if (!/^\d+$/.test(organizationId)) {
            const err = new Error('Invalid organization ID');
            err.status = 400;
            return next(err);
        }

        const organizationDetails = await getOrganizationById(organizationId);
        if (!organizationDetails) {
            const err = new Error('Organization not found');
            err.status = 404;
            return next(err);
        }

        const projects = await getProjectsByOrganization(organizationId);
        res.render('organization', { 
            title: 'Organization Details', 
            organizationDetails, 
            projects 
        });
    } catch (error) {
        next(error);
    }
};