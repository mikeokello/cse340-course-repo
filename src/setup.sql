-- User Account table
CREATE TABLE public.user_account (
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    user_role VARCHAR(50) NOT NULL DEFAULT 'user'
);

-- Organizations table
CREATE TABLE public.organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- Service Projects table
CREATE TABLE public.service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(200),
    FOREIGN KEY (organization_id) REFERENCES public.organization(organization_id) ON DELETE CASCADE
);

-- Categories table
CREATE TABLE public.category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Junction table for many-to-many relationship
CREATE TABLE public.project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, category_id),
    FOREIGN KEY (project_id) REFERENCES public.service_project(project_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES public.category(category_id) ON DELETE CASCADE
);

-- Volunteer table for many-to-many relationship between users and projects
CREATE TABLE public.project_volunteer (
    user_id INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    volunteered_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, project_id),
    FOREIGN KEY (user_id) REFERENCES public.user_account(user_id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES public.service_project(project_id) ON DELETE CASCADE
);

-- Insert sample organizations
INSERT INTO public.organization (name, description, contact_email, logo_filename) VALUES 
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png')
ON CONFLICT DO NOTHING;

-- Insert sample service projects
INSERT INTO public.service_project (organization_id, title, description, location) VALUES 
(1, 'Community Garden Build', 'Building raised garden beds for low-income families.', 'Downtown Community Center'),
(2, 'Urban Farm Workshop', 'Teaching sustainable farming techniques to local residents.', 'GreenHarvest Farm'),
(3, 'Food Drive Coordination', 'Organizing and distributing food to families in need.', 'UnityServe Center')
ON CONFLICT DO NOTHING;

-- Insert categories
INSERT INTO public.category (name) VALUES 
('Community Service'),
('Environment'),
('Education'),
('Health and Wellness'),
('Infrastructure'),
('Technology')
ON CONFLICT DO NOTHING;

-- Insert project categories
INSERT INTO public.project_category (project_id, category_id) VALUES 
(1, 2),  -- Community Garden Build is Environment
(1, 1),  -- Community Garden Build is Community Service
(2, 4),  -- Urban Farm Workshop is Health and Wellness
(2, 2),  -- Urban Farm Workshop is Environment
(3, 1)   -- Food Drive Coordination is Community Service
ON CONFLICT DO NOTHING;

-- Insert test admin user (password: cse340!)
-- The password hash below is: $2b$10$Z1h5HnWdP9nGe3/BQqL3rONNNQpqL1Qk7VE5hB8rJ7P5ZU5d5jXpm
INSERT INTO public.user_account (user_name, email, password, user_role) VALUES 
('Admin User', 'admin@example.com', '$2b$10$Z1h5HnWdP9nGe3/BQqL3rONNNQpqL1Qk7VE5hB8rJ7P5ZU5d5jXpm', 'admin')
ON CONFLICT (email) DO NOTHING;