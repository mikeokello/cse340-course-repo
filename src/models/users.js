import { db } from './db.js';
import bcrypt from 'bcrypt';

export const getAllUsers = async () => {
  try {
    const result = await db.query(
      'SELECT user_id, user_name, email, user_role FROM public.user_account ORDER BY user_name ASC'
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching users:', error.message);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const result = await db.query(
      'SELECT user_id, user_name, email, user_role FROM public.user_account WHERE user_id = $1',
      [userId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching user by ID:', error.message);
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const result = await db.query(
      'SELECT user_id, user_name, email, user_role, password FROM public.user_account WHERE email = $1',
      [email]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching user by email:', error.message);
    throw error;
  }
};

export const registerUser = async (userName, email, password) => {
  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user with default 'user' role
    const result = await db.query(
      'INSERT INTO public.user_account (user_name, email, password, user_role) VALUES ($1, $2, $3, $4) RETURNING user_id, user_name, email, user_role',
      [userName, email, hashedPassword, 'user']
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error registering user:', error.message);
    throw error;
  }
};

export const verifyPassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('Error verifying password:', error.message);
    throw error;
  }
};

export const authenticateUser = async (email, password) => {
  try {
    // Validate inputs
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify password
    const passwordValid = await verifyPassword(password, user.password);
    if (!passwordValid) {
      throw new Error('Invalid password');
    }

    // Return user object without password
    return {
      user_id: user.user_id,
      user_name: user.user_name,
      email: user.email,
      user_role: user.user_role
    };
  } catch (error) {
    console.error('Authentication error:', error.message);
    throw error;
  }
};
