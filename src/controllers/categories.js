import { getAllCategories, getCategoryById, createCategory, updateCategory, getCategoriesForProject, updateProjectCategories } from '../models/categories.js';
import { getProjectsByCategory, getProjectById } from '../models/projects.js';
import { getAllProjects } from '../models/projects.js';

export const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        res.render('categories', {
            title: 'Service Project Categories',
            categories,
            messages: req.session.messages || []
        });
        req.session.messages = [];
    } catch (error) {
        next(error);
    }
};

export const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        if (!/^\d+$/.test(categoryId)) {
            const err = new Error('Invalid category ID');
            err.status = 400;
            return next(err);
        }
        const categoryDetails = await getCategoryById(categoryId);
        if (!categoryDetails) {
            const err = new Error('Category not found');
            err.status = 404;
            return next(err);
        }
        const projects = await getProjectsByCategory(categoryId);
        res.render('category', {
            title: 'Category Details',
            categoryDetails,
            projects,
            messages: req.session.messages || []
        });
        req.session.messages = [];
    } catch (error) {
        next(error);
    }
};

// NEW: Show create form
export const showCreateCategoryForm = (req, res) => {
    res.render('category-form', {
        title: 'Create New Category',
        formData: {},
        errors: [],
        action: '/new-category',
        submitText: 'Create Category',
        messages: req.session.messages || []
    });
};

// NEW: Process create form
export const processCreateCategory = async (req, res, next) => {
    try {
        const { name } = req.body;
        const errors = validateCategory(name);

        if (errors.length > 0) {
            return res.render('category-form', {
                title: 'Create New Category',
                formData: { name },
                errors,
                action: '/new-category',
                submitText: 'Create Category',
                messages: req.session.messages || []
            });
        }

        await createCategory(name);
        req.session.messages = [{ type: 'success', text: 'Category created successfully!' }];
        res.redirect('/categories');
    } catch (error) {
        next(error);
    }
};

// NEW: Show edit form
export const showEditCategoryForm = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        if (!/^\d+$/.test(categoryId)) {
            const err = new Error('Invalid category ID');
            err.status = 400;
            return next(err);
        }
        const category = await getCategoryById(categoryId);
        if (!category) {
            const err = new Error('Category not found');
            err.status = 404;
            return next(err);
        }
        res.render('category-form', {
            title: 'Edit Category',
            formData: category,
            errors: [],
            action: `/edit-category/${categoryId}`,
            submitText: 'Update Category',
            messages: req.session.messages || []
        });
    } catch (error) {
        next(error);
    }
};

// NEW: Process edit form
export const processEditCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const { name } = req.body;
        const errors = validateCategory(name, 3); // min length 3 for server

        if (errors.length > 0) {
            return res.render('category-form', {
                title: 'Edit Category',
                formData: { category_id: categoryId, name },
                errors,
                action: `/edit-category/${categoryId}`,
                submitText: 'Update Category',
                messages: req.session.messages || []
            });
        }

        const updated = await updateCategory(categoryId, name);
        if (!updated) {
            const err = new Error('Category not found');
            err.status = 404;
            return next(err);
        }

        req.session.messages = [{ type: 'success', text: 'Category updated successfully!' }];
        res.redirect(`/category/${categoryId}`);
    } catch (error) {
        next(error);
    }
};

// NEW: Assign categories to project
export const showAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectById(projectId);
        if (!project) {
            const err = new Error('Project not found');
            err.status = 404;
            return next(err);
        }
        const allCategories = await getAllCategories();
        const projectCategories = await getCategoriesForProject(projectId);
        const selectedIds = projectCategories.map(c => c.category_id);

        res.render('assign-categories', {
            title: `Assign Categories to ${project.title}`,
            project,
            allCategories,
            selectedIds,
            errors: [],
            messages: req.session.messages || []
        });
    } catch (error) {
        next(error);
    }
};

export const processAssignCategories = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        let { categoryIds } = req.body;
        if (!Array.isArray(categoryIds)) categoryIds = categoryIds? [categoryIds] : [];

        await updateProjectCategories(projectId, categoryIds);
        req.session.messages = [{ type: 'success', text: 'Categories updated successfully!' }];
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        next(error);
    }
};

// Validation helper
const validateCategory = (name, minLength = 0) => {
    const errors = [];
    if (!name || name.trim() === '') {
        errors.push('Category name is required');
    } else {
        if (name.trim().length > 100) {
            errors.push('Category name must be 100 characters or less');
        }
        if (name.trim().length < minLength) {
            errors.push(`Category name must be at least ${minLength} characters`);
        }
    }
    return errors;
};