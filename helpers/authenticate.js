import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import HttpError from './HttpError.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret_key';

const authenticate = async (req, res, next) => {
  try {
    // Отримання токену з заголовків
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw HttpError(401, 'Not authorized');
    }
    
    // Перевірка формату "Bearer token"
    const [bearer, token] = authHeader.split(' ');
    
    if (bearer !== 'Bearer' || !token) {
      throw HttpError(401, 'Not authorized');
    }
    
    // Перевірка валідності токену
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw HttpError(401, 'Not authorized');
    }
    
    // Знаходження користувача в базі даних
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      throw HttpError(401, 'Not authorized');
    }
    
    // Перевірка чи збігається токен з тим що в базі
    if (user.token !== token) {
      throw HttpError(401, 'Not authorized');
    }
    
    // Додавання користувача до req.user
    req.user = {
      id: user.id,
      email: user.email,
      subscription: user.subscription
    };
    
    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate; 