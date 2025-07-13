import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Налаштування транспорта для ukr.net
const config = {
  host: process.env.EMAIL_HOST || 'smtp.ukr.net',
  port: process.env.EMAIL_PORT || 465,
  secure: process.env.EMAIL_SECURE === 'true' || true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
};

// Створення транспорта
const transporter = nodemailer.createTransport(config);

// Функція для відправлення email
const sendEmail = async (emailOptions) => {
  try {
    const info = await transporter.sendMail(emailOptions);
    console.log('Email sent successfully:', info);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Функція для відправлення вітального листа
const sendWelcomeEmail = async (userEmail, userName) => {
  const emailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Ласкаво просимо!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Вітаємо, ${userName}!</h2>
        <p>Дякуємо за реєстрацію в нашому сервісі.</p>
        <p>Ваш акаунт було успішно створено і тепер ви можете користуватися всіма функціями.</p>
        <p style="color: #666; font-size: 14px;">З найкращими побажаннями,<br>Команда розробки</p>
      </div>
    `,
  };

  return await sendEmail(emailOptions);
};

// Функція для відправлення листа підтвердження
const sendVerificationEmail = async (userEmail, verificationToken) => {
  const emailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Підтвердження електронної пошти',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Підтвердження електронної пошти</h2>
        <p>Для завершення реєстрації, будь ласка, підтвердіть вашу електронну пошту:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.BASE_URL}/api/auth/verify/${verificationToken}" 
             style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Підтвердити Email
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">Якщо кнопка не працює, скопіюйте та вставте це посилання в браузер:</p>
        <p style="color: #666; font-size: 14px; word-break: break-all;">${process.env.BASE_URL}/api/auth/verify/${verificationToken}</p>
      </div>
    `,
  };

  return await sendEmail(emailOptions);
};

// Функція для відправлення листа скидання пароля
const sendPasswordResetEmail = async (userEmail, resetToken) => {
  const emailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Скидання пароля',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Скидання пароля</h2>
        <p>Ви запросили скидання пароля для вашого акаунта.</p>
        <p>Натисніть на кнопку нижче, щоб створити новий пароль:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.BASE_URL}/api/users/reset-password/${resetToken}" 
             style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Скинути пароль
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">Якщо ви не запрошували скидання пароля, просто проігноруйте цей лист.</p>
        <p style="color: #666; font-size: 14px;">Це посилання діє протягом 1 години.</p>
      </div>
    `,
  };

  return await sendEmail(emailOptions);
};

export {
  sendEmail,
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
}; 