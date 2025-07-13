import multer from 'multer';
import path from 'path';

// Налаштування зберігання файлів
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'temp'); // тимчасова папка
  },
  filename: function (req, file, cb) {
    // Генеруємо унікальне ім'я з оригінальним розширенням
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Фільтр для перевірки типу файлу
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Налаштування multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // максимум 5MB
  },
  fileFilter: fileFilter
});

export default upload; 