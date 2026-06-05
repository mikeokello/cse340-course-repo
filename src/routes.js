import express from 'express';
import { showHomePage } from './controllers/index.js';
import {
    showLoginForm,
    showRegisterForm,
    processLogin,
    processRegister,
    processLogout,
    showDashboard
} from './controllers/auth.js';
import { showUsersPage } from './controllers/users.js';
import { requireLogin, requireRole } from './middleware.js';
import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showCreateOrganizationForm,
    processCreateOrganization,
    showEditOrganizationForm,
    processEditOrganization
} from './controllers/organizations.js';
import {
    showProjectsPage,
    showProjectDetailsPage,
    showCreateProjectForm,
    processCreateProject,
    showEditProjectForm,
    processEditProject
} from './controllers/projects.js';
import {
    showCategoriesPage,
    showCategoryDetailsPage,
    showCreateCategoryForm,
    processCreateCategory,
    showEditCategoryForm,
    processEditCategory,
    showAssignCategoriesForm,
    processAssignCategories
} from './controllers/categories.js';
import {
    processAddVolunteer,
    processRemoveVolunteer,
    processRemoveVolunteerFromDashboard
} from './controllers/volunteers.js';
import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

router.get('/', showHomePage);

// Authentication routes
router.get('/login', showLoginForm);
router.post('/login', processLogin);
router.get('/register', showRegisterForm);
router.post('/register', processRegister);
router.get('/logout', processLogout);

// Dashboard (requires login)
router.get('/dashboard', requireLogin, showDashboard);

// Users page (requires admin role)
router.get('/users', requireRole('admin'), showUsersPage);

// Organizations
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/new-organization', requireRole('admin'), showCreateOrganizationForm);
router.post('/new-organization', requireRole('admin'), processCreateOrganization);
router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);
router.post('/edit-organization/:id', requireRole('admin'), processEditOrganization);

// Projects
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/new-project', requireRole('admin'), showCreateProjectForm);
router.post('/new-project', requireRole('admin'), processCreateProject);
router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);
router.post('/edit-project/:id', requireRole('admin'), processEditProject);
router.get('/assign-categories/:id', requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-categories/:id', requireRole('admin'), processAssignCategories);

// Categories
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);
router.get('/new-category', requireRole('admin'), showCreateCategoryForm);
router.post('/new-category', requireRole('admin'), processCreateCategory);
router.get('/edit-category/:id', requireRole('admin'), showEditCategoryForm);
router.post('/edit-category/:id', requireRole('admin'), processEditCategory);

// Volunteering
router.post('/volunteer/:id', requireLogin, processAddVolunteer);
router.post('/unvolunteer/:id', requireLogin, processRemoveVolunteer);
router.post('/remove-volunteer/:id', requireLogin, processRemoveVolunteerFromDashboard);

router.get('/test-error', testErrorPage);

export default router;