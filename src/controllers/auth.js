import { registerUser, authenticateUser, getUserById } from '../models/users.js';

export const showLoginForm = (req, res) => {
  res.render('login', { title: 'Login' });
};

export const showRegisterForm = (req, res) => {
  res.render('register', { title: 'Register' });
};

export const processLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authenticateUser(email, password);
    
    // Store user in session
    req.session.userId = user.user_id;
    req.session.userName = user.user_name;
    req.session.userEmail = user.email;
    req.session.userRole = user.user_role;

    // Store message
    req.session.messages = [`Welcome back, ${user.user_name}!`];
    
    res.redirect('/dashboard');
  } catch (error) {
    req.session.messages = [`Login failed: ${error.message}`];
    res.status(401).render('login', { title: 'Login' });
  }
};

export const processRegister = async (req, res) => {
  const { userName, email, password, passwordConfirm } = req.body;

  try {
    // Validate input
    if (!userName || !email || !password || !passwordConfirm) {
      req.session.messages = ['All fields are required'];
      return res.render('register', { title: 'Register' });
    }

    if (password !== passwordConfirm) {
      req.session.messages = ['Passwords do not match'];
      return res.render('register', { title: 'Register' });
    }

    if (password.length < 8) {
      req.session.messages = ['Password must be at least 8 characters long'];
      return res.render('register', { title: 'Register' });
    }

    // Register user
    const newUser = await registerUser(userName, email, password);

    // Store user in session
    req.session.userId = newUser.user_id;
    req.session.userName = newUser.user_name;
    req.session.userEmail = newUser.email;
    req.session.userRole = newUser.user_role;

    // Store message
    req.session.messages = [`Registration successful! Welcome, ${newUser.user_name}!`];

    res.redirect('/dashboard');
  } catch (error) {
    req.session.messages = [`Registration failed: ${error.message}`];
    res.status(400).render('register', { title: 'Register' });
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
    const user = await getUserById(req.session.userId);
    res.render('dashboard', { title: 'Dashboard', user });
  } catch (error) {
    console.error('Error showing dashboard:', error.message);
    res.status(500).render('errors/500', { title: 'Server Error', error: error.message });
  }
};
