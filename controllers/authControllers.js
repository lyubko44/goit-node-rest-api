import * as authService from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";
import { sendEmail } from "../services/emailServices.js";

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
    } else if (error.message === 'Email not verified') {
      next(HttpError(401, error.message));
    } else {
      next(HttpError(500, error.message));
    }
  }
};

// Контролер логауту
export const logout = async (req, res, next) => {
  try {
    await authService.logoutUser(req.user.id);
    res.status(204).send();
  } catch (error) {
    if (error.message === 'Not authorized') {
      next(HttpError(401, error.message));
    } else {
      next(HttpError(500, error.message));
    }
  }
};

// Контролер отримання поточного користувача
export const current = async (req, res, next) => {
  try {
    const result = await authService.getCurrentUser(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === 'Not authorized') {
      next(HttpError(401, error.message));
    } else {
      next(HttpError(500, error.message));
    }
  }
};

// Контролер оновлення аватара
export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(HttpError(400, 'Avatar file is required'));
    }
    
    const result = await authService.updateAvatar(req.user.id, req.file);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === 'Not authorized') {
      next(HttpError(401, error.message));
    } else {
      next(HttpError(500, error.message));
    }
  }
};

// Контролер повторної відправки email для верифікації
export const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    const result = await authService.resendVerificationEmail(email);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === 'User not found') {
      next(HttpError(404, error.message));
    } else if (error.message === 'Verification has already been passed') {
      next(HttpError(400, error.message));
    } else {
      next(HttpError(500, error.message));
    }
  }
};

// Контролер верифікації користувача
export const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    
    const result = await authService.verifyUser(verificationToken);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === 'User not found') {
      next(HttpError(404, error.message));
    } else {
      next(HttpError(500, error.message));
    }
  }
};

// Контролер для тестування email
export const sendTestEmail = async (req, res, next) => {
  try {
    const { to, subject, text } = req.body;
    
    if (!to || !subject || !text) {
      return next(HttpError(400, 'Fields to, subject, and text are required'));
    }
    
    const emailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Тестовий лист</h2>
          <p>${text}</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            Відправлено з REST API застосунку<br>
            Час відправлення: ${new Date().toLocaleString('uk-UA')}
          </p>
        </div>
      `,
    };
    
    const result = await sendEmail(emailOptions);
    
    res.status(200).json({
      message: 'Email sent successfully',
      details: {
        messageId: result.messageId,
        from: emailOptions.from,
        to: emailOptions.to,
        subject: emailOptions.subject,
      }
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    next(HttpError(500, 'Failed to send email'));
  }
}; 