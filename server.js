import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT || 3000

// Set view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Static middleware - serves public folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
const getHome = async (req, res) => {
  const pageTitle = 'Home'
  res.render('index', { title: pageTitle })
}

const getOrganizations = async (req, res) => {
  const pageTitle = 'Organizations'
  res.render('organizations', { title: pageTitle })
}

const getProjects = async (req, res) => {
  const pageTitle = 'Service Projects'
  res.render('projects', { title: pageTitle })
}

const getCategories = async (req, res) => {
  const pageTitle = 'Service Project Categories'
  const categories = [
    'Environmental',
    'Educational', 
    'Community Service',
    'Health and Wellness'
  ]
  res.render('categories', { title: pageTitle, categories })
}

app.get('/', getHome)
app.get('/organizations', getOrganizations)
app.get('/projects', getProjects)
app.get('/categories', getCategories)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})