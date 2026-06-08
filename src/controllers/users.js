import { getAllUsers } from '../models/users.js';

export const showUsersPage = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.render('users', { title: 'Registered Users', users, messages: req.session.messages || [] });
    req.session.messages = [];
  } catch (error) {
    console.error('Error showing users page:', error.message);
    res.status(500).render('errors/500', { title: 'Server Error', error: error.message, messages: req.session.messages || [] });
  }
};
