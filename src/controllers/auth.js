import { registerUser, authenticateUser, getUserById } from '../models/users.js';
import { getVolunteerProjects } from '../models/volunteers.js';

export const showLoginForm = (req, res) => {
  res.render('login', { title: 'Login' });
};

export const showRegisterForm = (req, res) => {
  res.render('register', { title: 'Register' });
};

export const processLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      req.session.messages = [{ type: 'danger', text: 'Email and password are required' }];
      return res.render('login', { title: 'Login' });
    }

    // Authenticate user
    const user = await authenticateUser(email, password);
    
    // Store user in session
    req.session.userId = user.user_id;
    req.session.userName = user.user_name;
    req.session.userEmail = user.email;
    req.session.userRole = user.user_role;
    req.session.messages = [{ type: 'success', text: `Welcome back, ${user.user_name}!` }];
    
    // Save session before redirecting
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err.message);
        req.session.messages = [{ type: 'danger', text: 'Server error: Unable to save session' }];
        return res.render('login', { title: 'Login' });
      }
      res.redirect('/dashboard');
    });
  } catch (error) {
    console.error('Login error:', error.message);
    const errorMessage = error.message === 'User not found' 
      ? 'Invalid email or password'
      : error.message === 'Invalid password'
      ? 'Invalid email or password'
      : error.message || 'Login failed';
    
    req.session.messages = [{ type: 'danger', text: errorMessage }];
    res.render('login', { title: 'Login' });
  }
};

export const processRegister = async (req, res) => {
  const { userName, email, password, passwordConfirm } = req.body;

  try {
    // Validate input
    if (!userName || !email || !password || !passwordConfirm) {
      req.session.messages = [{ type: 'danger', text: 'All fields are required' }];
      return res.render('register', { title: 'Register' });
    }

    if (password !== passwordConfirm) {
      req.session.messages = [{ type: 'danger', text: 'Passwords do not match' }];
      return res.render('register', { title: 'Register' });
    }

    if (password.length < 8) {
      req.session.messages = [{ type: 'danger', text: 'Password must be at least 8 characters long' }];
      return res.render('register', { title: 'Register' });
    }

    // Register user
    const newUser = await registerUser(userName, email, password);

    // Store user in session
    req.session.userId = newUser.user_id;
    req.session.userName = newUser.user_name;
    req.session.userEmail = newUser.email;
    req.session.userRole = newUser.user_role;
    req.session.messages = [{ type: 'success', text: `Registration successful! Welcome, ${newUser.user_name}!` }];

    // Save session before redirecting
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err.message);
        req.session.messages = [{ type: 'danger', text: 'Server error: Unable to save session' }];
        return res.render('register', { title: 'Register' });
      }
      res.redirect('/dashboard');
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    const errorMessage = error.message || 'Registration failed';
    req.session.messages = [{ type: 'danger', text: errorMessage }];
    res.render('register', { title: 'Register' });
  }
};

export const processLogout = (req, res) => {
  const userName = req.session.userName || 'User';
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err.message);
    }
    res.redirect('/');
  });
};

export const showDashboard = async (req, res) => {
  try {
    // Double-check user exists in database
    const user = await getUserById(req.session.userId);
    if (!user) {
      req.session.destroy();
      return res.redirect('/login');
    }

    const volunteerProjects = await getVolunteerProjects(req.session.userId);
    const messages = req.session.messages || [];
    
    res.render('dashboard', { 
      title: 'Dashboard', 
      user,
      volunteerProjects
    });
    
    // Clear messages after rendering
    req.session.messages = [];
  } catch (error) {
    console.error('Error showing dashboard:', error.message);
    req.session.messages = [{ type: 'danger', text: `Error loading dashboard: ${error.message}` }];
    res.render('dashboard', { 
      title: 'Dashboard',
      user: null,
      volunteerProjects: [],
      error: true
    });
  }
};
