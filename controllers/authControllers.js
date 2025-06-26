import * as authService from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";

// Контролер реєстрації
export const register = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    if (error.message === 'Email in use') {
      next(HttpError(409, error.message));
    } else {
      next(HttpError(500, error.message));
    }
  }
};

// Контролер логіну
export const login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === 'Email or password is wrong') {
      next(HttpError(401, error.message));
    } else {
      next(HttpError(500, error.message));
    }
  }
}; 