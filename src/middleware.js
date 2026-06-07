// Middleware to check if user is logged in
export const requireLogin = (req, res, next) => {
  if (!req.session.userId) {
    req.session.messages = [{ type: 'danger', text: 'You must be logged in to access this page.' }];
    return res.redirect('/login');
  }
  next();
};

// Middleware to check if user has admin role
export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.session.userId) {
      req.session.messages = [{ type: 'danger', text: 'You must be logged in to access this page.' }];
      return res.redirect('/login');
    }

    if (req.session.userRole !== role) {
      req.session.messages = [{ type: 'danger', text: 'You do not have permission to access this page.' }];
      return res.redirect('/dashboard');
    }

    next();
  };
};

// Middleware to pass user data to all templates
export const passUserData = (req, res, next) => {
  if (req.session.userId) {
    res.locals.user = {
      userId: req.session.userId,
      userName: req.session.userName,
      userEmail: req.session.userEmail,
      userRole: req.session.userRole
    };
  } else {
    res.locals.user = null;
  }
  next();
};
