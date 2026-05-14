# CSE340 - Web Backend Development

A professional Node.js + Express + PostgreSQL web application showcasing service organizations and volunteer projects.

## Features

- ✅ Express.js server with EJS templating
- ✅ PostgreSQL database integration with connection pooling
- ✅ Dynamic organizations and service projects management
- ✅ Category-based project filtering
- ✅ Responsive design with modern CSS
- ✅ Error handling and logging
- ✅ Environment variable configuration
- ✅ SQL query logging for development

## Tech Stack

- **Backend**: Node.js, Express.js (v5.2.1)
- **Database**: PostgreSQL
- **Templating**: EJS
- **Environment**: dotenv for configuration
- **Node Version**: 14+ recommended

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- PostgreSQL database (local or remote via Render, PlanetScale, etc.)
- pgAdmin or similar SQL management tool

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/mikeokello/cse340-course-repo.git
cd cse340-course-repo
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
# Example for Render PostgreSQL
DATABASE_URL=postgresql://username:password@dpg-xxxxx.a.oregon-postgres.render.com/dbname
PORT=3000
NODE_ENV=development
ENABLE_SQL_LOGGING=true
```

### 4. Initialize the Database

Using **pgAdmin SQL Editor** or **psql**:

```bash
# Copy the entire contents of src/setup.sql
# Paste into your SQL editor and execute
```

Or via psql:

```bash
psql -U your_username -d your_database -f src/setup.sql
```

## Running the Application

### Development Mode

```bash
npm start
```

Server will run at: `http://127.0.0.1:3000`

### Database Connection Logging

Set `ENABLE_SQL_LOGGING=true` in `.env` to see executed queries and timing in console.

## Project Structure

```
├── src/
│   ├── models/
│   │   ├── db.js              # Database connection pool
│   │   ├── organizations.js   # Organizations queries
│   │   ├── categories.js      # Categories queries
│   │   ├── projects.js        # Service projects queries
│   │   └── setup.sql          # Database initialization script
│   └── views/                 # EJS templates (moved from views/)
├── views/                     # EJS page templates
│   ├── partials/
│   │   ├── header.ejs        # Navigation & header
│   │   └── footer.ejs        # Footer
│   ├── index.ejs             # Home page
│   ├── organizations.ejs      # Organizations listing
│   ├── projects.ejs          # Service projects listing
│   ├── categories.ejs        # Categories listing
│   └── error.ejs             # Error page
├── public/
│   └── css/
│       └── styles.css        # Professional responsive styling
├── package.json
├── server.js                 # Main Express application
├── .env                      # Environment variables (DO NOT commit)
├── .env.example              # Environment template
└── .gitignore               # Git ignore configuration
```

## Available Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/` | GET | Home page |
| `/organizations` | GET | List all organizations |
| `/projects` | GET | List all service projects |
| `/categories` | GET | List all project categories |

## Database Schema

### Tables

- **organization**: Partner organizations
  - Fields: organization_id, name, description, contact_email, logo_filename

- **service_project**: Volunteer opportunities
  - Fields: project_id, organization_id, title, description, location

- **category**: Project categories
  - Fields: category_id, name

- **project_category**: Junction table for many-to-many relationships
  - Fields: project_id, category_id

## Environment Variables

```env
# Required
DATABASE_URL=postgresql://user:password@host:port/database

# Optional
PORT=3000                      # Default: 3000
NODE_ENV=development          # Default: development
ENABLE_SQL_LOGGING=true       # Default: false
```

## Error Handling

The application includes comprehensive error handling:
- Database connection failures
- Route not found (404)
- Server errors (500)
- Query execution errors with detailed logging

## Features in Detail

### Dynamic Data Loading

All pages load data from PostgreSQL database:
- Organizations pulled from `organization` table
- Projects fetched with joined organization and category data
- Categories retrieved and displayed dynamically

### Responsive Design

- Mobile-first approach
- Works on all screen sizes (480px+)
- Accessible navigation and form controls
- Optimized performance

### SQL Query Logging

When `ENABLE_SQL_LOGGING=true`, queries show:
```
Executed query: {text, duration, rows}
```

Useful for debugging and optimization.

## Troubleshooting

### Database Connection Failed

**Error**: `Error connecting to the database`

**Solution**:
1. Verify DATABASE_URL in `.env`
2. Check database credentials are correct
3. Ensure database is running and accessible
4. For Render: Check if free tier limits are exceeded

### Port Already in Use

**Solution**:
```bash
# Use a different port
PORT=3001 npm start
```

### Module Not Found

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Deployment

### Render.com (Recommended for Free Tier)

1. Create PostgreSQL database on Render
2. Copy connection string to DATABASE_URL
3. Deploy via GitHub or direct upload
4. Set environment variables in Render dashboard
5. Run: `npm start`

### Other Platforms

Works on Heroku, Railway, Fly.io, etc. Ensure:
- Node.js buildpack configured
- Environment variables set
- PostgreSQL database created

## Security Notes

⚠️ **Important**:
- Never commit `.env` file to Git
- Use environment variables for sensitive data
- pgAdmin SQL should never be exposed publicly
- Validate and sanitize user input before database queries

## Development Tips

1. **Test database connection**:
   ```bash
   npm start
   # Should show: ✓ Database connection successful
   ```

2. **Check logs**:
   - Terminal output shows all server and database activity
   - Enable SQL_LOGGING for query debugging

3. **SQL Modifications**:
   - Update `src/setup.sql` for schema changes
   - Re-run script in pgAdmin to update database
   - Create new model functions for data access

## Contributing

When adding features:
1. Create database model in `src/models/`
2. Add routes in `server.js`
3. Create EJS views in `views/`
4. Update CSS in `public/css/styles.css`
5. Test thoroughly before committing

## License

ISC

## Support

For issues, check:
1. Database connection credentials
2. PostgreSQL is running
3. .env file is properly configured
4. Node.js version compatibility

---

**Last Updated**: May 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✓

