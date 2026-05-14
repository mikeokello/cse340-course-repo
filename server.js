import express from 'express';
import dotenv from 'dotenv';
import { testConnection } from './src/models/db.js';
import { initializeDatabase } from './src/models/init.js';
import { getAllOrganizations } from './src/models/organizations.js';
import { getAllCategories } from './src/models/categories.js';
import { getAllProjects } from './src/models/projects.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// View engine setup
app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

app.get('/organizations', async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();
        const title = 'Our Partner Organizations';
        res.render('organizations', { title, organizations });
    } catch (error) {
        console.error('Route error - /organizations:', error.message);
        res.status(500).render('error', { 
            title: 'Error', 
            message: 'Unable to load organizations. Please try again later.' 
        });
    }
});

app.get('/projects', async (req, res, next) => {
    try {
        const projects = await getAllProjects();
        const title = 'Service Projects';
        res.render('projects', { title, projects });
    } catch (error) {
        console.error('Route error - /projects:', error.message);
        res.status(500).render('error', { 
            title: 'Error', 
            message: 'Unable to load service projects. Please try again later.' 
        });
    }
});

app.get('/categories', async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        const title = 'Service Project Categories';
        res.render('categories', { title, categories });
    } catch (error) {
        console.error('Route error - /categories:', error.message);
        res.status(500).render('error', { 
            title: 'Error', 
            message: 'Unable to load categories. Please try again later.' 
        });
    }
});

// 404 error handler
app.use((req, res) => {
    res.status(404).render('error', { 
        title: 'Not Found', 
        message: 'The page you are looking for does not exist.' 
    });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    const isDevelopment = NODE_ENV === 'development';
    
    console.error('='.repeat(50));
    console.error('UNHANDLED ERROR:', {
        timestamp: new Date().toISOString(),
        status: statusCode,
        message: err.message,
        path: req.path,
        method: req.method
    });
    if (isDevelopment) {
        console.error('Stack:', err.stack);
    }
    console.error('='.repeat(50));
    
    res.status(statusCode).render('error', {
        title: statusCode === 404 ? 'Not Found' : 'Server Error',
        message: isDevelopment 
            ? err.message 
            : 'An error occurred. Our team has been notified. Please try again later.'
    });
});

// Start server
app.listen(PORT, async () => {
    try {
        await testConnection();
        console.log(`✓ Database connection successful`);
        
        // Initialize database with tables and sample data
        await initializeDatabase();
        
        console.log(`✓ Server is running at http://127.0.0.1:${PORT}`);
        console.log(`✓ Environment: ${NODE_ENV}`);
        console.log(`✓ All systems operational`);
    } catch (error) {
        console.error('✗ Failed to start server:', error.message);
        console.error('✗ Check your database connection and try again');
        process.exit(1);
    }
});