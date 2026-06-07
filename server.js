import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import { testConnection } from './src/models/db.js';
import { initializeDatabase } from './src/models/init.js';
import { passUserData } from './src/middleware.js';
import router from './src/routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Session middleware - required for flash messages
app.use(session({
    secret: process.env.SESSION_SECRET || 'cse340-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 600000 }
}));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware: Log requests in development
app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

// Middleware: Make NODE_ENV and messages available to all templates
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    res.locals.messages = req.session.messages || [];
    next();
});

// Middleware: Pass user data to all templates
app.use(passUserData);

// Use router
app.use(router);

// 404 catch-all route
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// Global error handler - only for unhandled errors
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';

    console.error('UNHANDLED ERROR:', err.message);
    if (NODE_ENV === 'development') {
        console.error(err.stack);
    }

    // Don't render error page if response has already been sent
    if (res.headersSent) {
        return;
    }

    try {
        res.status(status).render(`errors/${template}`, {
            title: status === 404 ? 'Page Not Found' : 'Server Error',
            error: err.message,
            stack: err.stack,
            NODE_ENV
        });
    } catch (renderError) {
        // Fallback plain text response if template rendering fails
        console.error('Error rendering error page:', renderError.message);
        res.status(status).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${status === 404 ? 'Page Not Found' : 'Server Error'}</title>
            </head>
            <body>
                <h1>${status === 404 ? 'Page Not Found' : 'Server Error'}</h1>
                <p>We are experiencing technical difficulties.</p>
                <a href="/">Return to homepage</a>
            </body>
            </html>
        `);
    }
});

app.listen(PORT, async () => {
    try {
        await testConnection();
        await initializeDatabase();
        console.log(`Server running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
});