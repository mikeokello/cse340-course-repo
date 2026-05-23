import { getAllCategories, getCategoryById } from '../models/categories.js';
import { getProjectsByCategory } from '../models/projects.js';

export const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        res.render('categories', { title: 'Service Project Categories', categories });
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
            projects 
        });
    } catch (error) {
        next(error);
    }
};