import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret_key';

// Генерація JWT токену
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
};

// Реєстрація користувача
export const registerUser = async (userData) => {
  try {
    const { email, password } = userData;
    
    // Перевірка чи користувач з таким email вже існує
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Email in use');
    }
    
    // Хешування паролю
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Створення користувача
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });
    
    return {
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      }
    };
  } catch (error) {
    throw error;
  }
};

// Логін користувача
export const loginUser = async (userData) => {
  try {
    const { email, password } = userData;
    
    // Знаходження користувача за email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Email or password is wrong');
    }
    
    // Перевірка паролю
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Email or password is wrong');
    }
    
    // Генерація токену
    const token = generateToken(user.id);
    
    // Збереження токену в базі даних
    await user.update({ token });
    
    return {
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      }
    };
  } catch (error) {
    throw error;
  }
};

// Логаут користувача
export const logoutUser = async (userId) => {
  try {
    // Знаходження користувача за id
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('Not authorized');
    }
    
    // Видалення токену з бази даних
    await user.update({ token: null });
    
    return true;
  } catch (error) {
    throw error;
  }
}; 