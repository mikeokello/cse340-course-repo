import { db } from './db.js'

export const initializeDatabase = async () => {
  try {
    console.log('🔧 Initializing database...')

    try {
      // Drop existing tables in correct order (respecting foreign keys)
      try {
        await db.query('DROP TABLE IF EXISTS public.project_volunteer CASCADE')
        await db.query('DROP TABLE IF EXISTS public.project_category CASCADE')
        await db.query('DROP TABLE IF EXISTS public.service_project CASCADE')
        await db.query('DROP TABLE IF EXISTS public.category CASCADE')
        await db.query('DROP TABLE IF EXISTS public.organization CASCADE')
        await db.query('DROP TABLE IF EXISTS public.user_account CASCADE')
        console.log('✓ Cleaned up existing tables')
      } catch (e) {
        // Tables might not exist, that's okay
      }

      // Create user_account table
      await db.query(`
        CREATE TABLE public.user_account (
            user_id SERIAL PRIMARY KEY,
            user_name VARCHAR(100) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            user_role VARCHAR(50) NOT NULL DEFAULT 'user'
        )
      `)
      console.log('✓ User_account table created')

      // Create organization table
      await db.query(`
        CREATE TABLE public.organization (
            organization_id SERIAL PRIMARY KEY,
            name VARCHAR(150) NOT NULL,
            description TEXT NOT NULL,
            contact_email VARCHAR(255) NOT NULL,
            logo_filename VARCHAR(255) NOT NULL
        )
      `)
      console.log('✓ Organization table created')

      // Create service_project table
      await db.query(`
        CREATE TABLE public.service_project (
            project_id SERIAL PRIMARY KEY,
            organization_id INTEGER NOT NULL,
            title VARCHAR(200) NOT NULL,
            description TEXT NOT NULL,
            location VARCHAR(200),
            FOREIGN KEY (organization_id) REFERENCES public.organization(organization_id) ON DELETE CASCADE
        )
      `)
      console.log('✓ Service_project table created')

      // Create category table
      await db.query(`
        CREATE TABLE public.category (
            category_id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL UNIQUE
        )
      `)
      console.log('✓ Category table created')

      // Create project_category junction table
      await db.query(`
        CREATE TABLE public.project_category (
            project_id INTEGER NOT NULL,
            category_id INTEGER NOT NULL,
            PRIMARY KEY (project_id, category_id),
            FOREIGN KEY (project_id) REFERENCES public.service_project(project_id) ON DELETE CASCADE,
            FOREIGN KEY (category_id) REFERENCES public.category(category_id) ON DELETE CASCADE
        )
      `)
      console.log('✓ Project_category table created')

      // Create project_volunteer table
      await db.query(`
        CREATE TABLE public.project_volunteer (
            user_id INTEGER NOT NULL,
            project_id INTEGER NOT NULL,
            volunteered_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, project_id),
            FOREIGN KEY (user_id) REFERENCES public.user_account(user_id) ON DELETE CASCADE,
            FOREIGN KEY (project_id) REFERENCES public.service_project(project_id) ON DELETE CASCADE
        )
      `)
      console.log('✓ Project_volunteer table created')

      // Insert sample organizations
      const orgQuery = `
        INSERT INTO public.organization (name, description, contact_email, logo_filename) 
        VALUES 
          ('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.svg'),
          ('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.svg'),
          ('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.svg')
        ON CONFLICT DO NOTHING
      `
      await db.query(orgQuery)
      console.log('✓ Organizations inserted')

      // Insert sample service projects
      const projectQuery = `
        INSERT INTO public.service_project (organization_id, title, description, location) 
        VALUES 
          (1, 'Community Garden Build', 'Building raised garden beds for low-income families.', 'Downtown Community Center'),
          (2, 'Urban Farm Workshop', 'Teaching sustainable farming techniques to local residents.', 'GreenHarvest Farm'),
          (3, 'Food Drive Coordination', 'Organizing and distributing food to families in need.', 'UnityServe Center')
        ON CONFLICT DO NOTHING
      `
      await db.query(projectQuery)
      console.log('✓ Service projects inserted')

      // Insert categories
      const categoryQuery = `
        INSERT INTO public.category (name) 
        VALUES 
          ('Community Service'),
          ('Environment'),
          ('Education'),
          ('Health and Wellness'),
          ('Infrastructure'),
          ('Technology')
        ON CONFLICT DO NOTHING
      `
      await db.query(categoryQuery)
      console.log('✓ Categories inserted')

      // Insert project-category relationships
      const pcQuery = `
        INSERT INTO public.project_category (project_id, category_id) 
        VALUES 
          (1, 2),
          (1, 1),
          (2, 4),
          (2, 2),
          (3, 1)
        ON CONFLICT DO NOTHING
      `
      await db.query(pcQuery)
      console.log('✓ Project categories linked')

      // Create admin user (for testing)
      const bcryptModule = await import('bcrypt')
      const bcrypt = bcryptModule.default
      const adminPassword = await bcrypt.hash('cse340!', 10)
      const adminQuery = `
        INSERT INTO public.user_account (user_name, email, password, user_role) 
        VALUES ('Admin User', 'admin@example.com', $1, 'admin')
        ON CONFLICT (email) DO NOTHING
      `
      await db.query(adminQuery, [adminPassword])
      console.log('✓ Admin user created')

      console.log('✅ Database initialization complete')
      return true
    } catch (initError) {
      console.error('⚠️ Database initialization error:', initError.message)
      // Don't throw - allow server to continue even if init fails
      return false
    }
  } catch (error) {
    console.error('✗ Critical database initialization error:', error.message)
    return false
  }
}
