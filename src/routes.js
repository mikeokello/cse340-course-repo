import express from 'express';
import { showHomePage } from './controllers/index.js';
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
import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

router.get('/', showHomePage);

// Organizations
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/new-organization', showCreateOrganizationForm);
router.post('/new-organization', processCreateOrganization);
router.get('/edit-organization/:id', showEditOrganizationForm);
router.post('/edit-organization/:id', processEditOrganization);

// Projects
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/new-project', showCreateProjectForm);
router.post('/new-project', processCreateProject);
router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', processEditProject);
router.get('/assign-categories/:id', showAssignCategoriesForm);
router.post('/assign-categories/:id', processAssignCategories);

// Categories
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);
router.get('/new-category', showCreateCategoryForm);
router.post('/new-category', processCreateCategory);
router.get('/edit-category/:id', showEditCategoryForm);
router.post('/edit-category/:id', processEditCategory);

router.get('/test-error', testErrorPage);

export default router;