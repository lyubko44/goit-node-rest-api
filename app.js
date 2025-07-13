import express from "express";
import morgan from "morgan";
import cors from "cors";

import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";
import sequelize, { testConnection } from "./db/config.js";
import "./models/index.js"; // Імпорт моделей з асоціаціями

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

// Налаштування роздачі статичних файлів
app.use(express.static("public"));

app.use("/api/contacts", contactsRouter);
app.use("/api/auth", authRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

// Ініціалізація бази даних та запуск сервера
const startServer = async () => {
  try {
    // Тестування підключення до бази даних
    await testConnection();
    
    // Синхронізація моделей з базою даних
    await sequelize.sync();
    console.log('Database synchronized successfully');
    
    // Запуск сервера
    app.listen(3000, () => {
      console.log("Server is running. Use our API on port: 3000");
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
