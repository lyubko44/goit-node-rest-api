import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
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
    
    // Генерація аватара через gravatar
    const avatarURL = gravatar.url(email, {
      s: '250',
      r: 'pg',
      d: 'identicon'
    }, true);
    
    // Створення користувача
    const newUser = await User.create({
      email,
      password: hashedPassword,
      avatarURL,
    });
    
    return {
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
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
        avatarURL: user.avatarURL,
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

// Отримання даних поточного користувача
export const getCurrentUser = async (userId) => {
  try {
    // Знаходження користувача за id
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('Not authorized');
    }
    
    return {
      email: user.email,
      subscription: user.subscription,
      avatarURL: user.avatarURL,
    };
  } catch (error) {
    throw error;
  }
};

// Оновлення аватара користувача
export const updateAvatar = async (userId, file) => {
  try {
    // Знаходження користувача за id
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('Not authorized');
    }

    // Генерація унікального імені файлу
    const fileExtension = path.extname(file.originalname);
    const uniqueFileName = `${uuidv4()}${fileExtension}`;
    
    // Шляхи до файлів
    const tempPath = file.path;
    const finalPath = path.join('public', 'avatars', uniqueFileName);
    
    // Переміщення файлу з temp до public/avatars
    await fs.rename(tempPath, finalPath);
    
    // Створення URL для аватара
    const avatarURL = `/avatars/${uniqueFileName}`;
    
    // Оновлення користувача в базі даних
    await user.update({ avatarURL });
    
    return { avatarURL };
  } catch (error) {
    // Видалення тимчасового файлу в разі помилки
    if (file && file.path) {
      try {
        await fs.unlink(file.path);
      } catch (unlinkError) {
        console.error('Error deleting temp file:', unlinkError);
      }
    }
    throw error;
  }
}; 