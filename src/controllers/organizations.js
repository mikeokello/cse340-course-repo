import { getAllOrganizations, getOrganizationById, createOrganization, updateOrganization } from '../models/organizations.js';
import { getProjectsByOrganization } from '../models/projects.js';

export const showOrganizationsPage = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();
        res.render('organizations', {
            title: 'Our Partner Organizations',
            organizations,
            messages: req.session.messages || []
        });
        req.session.messages = [];
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
            projects,
            messages: req.session.messages || []
        });
        req.session.messages = [];
    } catch (error) {
        next(error);
    }
};

// NEW: Create
export const showCreateOrganizationForm = (req, res) => {
    res.render('organization-form', {
        title: 'Create New Organization',
        formData: {},
        errors: [],
        action: '/new-organization',
        submitText: 'Create Organization'
    });
};

export const processCreateOrganization = async (req, res, next) => {
    try {
        const { name, description, contact_email, logo_filename } = req.body;
        const errors = validateOrganization(name, description, contact_email, logo_filename);

        if (errors.length > 0) {
            return res.render('organization-form', {
                title: 'Create New Organization',
                formData: req.body,
                errors,
                action: '/new-organization',
                submitText: 'Create Organization'
            });
        }

        await createOrganization(name, description, contact_email, logo_filename);
        req.session.messages = [{ type: 'success', text: 'Organization created successfully!' }];
        res.redirect('/organizations');
    } catch (error) {
        next(error);
    }
};

// NEW: Edit
export const showEditOrganizationForm = async (req, res, next) => {
    try {
        const organizationId = req.params.id;
        const org = await getOrganizationById(organizationId);
        if (!org) {
            const err = new Error('Organization not found');
            err.status = 404;
            return next(err);
        }
        res.render('organization-form', {
            title: 'Edit Organization',
            formData: org,
            errors: [],
            action: `/edit-organization/${organizationId}`,
            submitText: 'Update Organization'
        });
    } catch (error) {
        next(error);
    }
};

export const processEditOrganization = async (req, res, next) => {
    try {
        const organizationId = req.params.id;
        const { name, description, contact_email, logo_filename } = req.body;
        const errors = validateOrganization(name, description, contact_email, logo_filename, 3);

        if (errors.length > 0) {
            return res.render('organization-form', {
                title: 'Edit Organization',
                formData: { organization_id: organizationId,...req.body },
                errors,
                action: `/edit-organization/${organizationId}`,
                submitText: 'Update Organization'
            });
        }

        const updated = await updateOrganization(organizationId, name, description, contact_email, logo_filename);
        if (!updated) {
            const err = new Error('Organization not found');
            err.status = 404;
            return next(err);
        }

        req.session.messages = [{ type: 'success', text: 'Organization updated successfully!' }];
        res.redirect(`/organization/${organizationId}`);
    } catch (error) {
        next(error);
    }
};

const validateOrganization = (name, description, email, logo, minLength = 0) => {
    const errors = [];
    if (!name || name.trim() === '') errors.push('Name is required');
    if (name && name.trim().length > 150) errors.push('Name must be 150 characters or less');
    if (name && name.trim().length < minLength) errors.push(`Name must be at least ${minLength} characters`);

    if (!description || description.trim() === '') errors.push('Description is required');

    if (!email || email.trim() === '') errors.push('Email is required');
    if (email &&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Valid email is required');

    if (!logo || logo.trim() === '') errors.push('Logo filename is required');
    return errors;
};