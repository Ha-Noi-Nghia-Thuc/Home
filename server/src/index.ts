import dotenv from "dotenv";
import express from "express";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import adminRouter from "./routes/admin.route";
import articleRouter from "./routes/article.route";
import roleRequestRouter from "./routes/role-request.route";
import userRouter from "./routes/user.route";

// Khởi tạo Prisma Client
const prisma = new PrismaClient();

// Khởi tạo Express app
const app = express();
const API_PREFIX = process.env.API_PREFIX || "/api";

// Middleware cơ bản
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "common" : "dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Cấu hình CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Cho phép requests không có origin (như mobile apps hoặc curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `CORS bị từ chối cho origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Kiểm tra kết nối API
app.get("/", (req, res) => {
  res.send("API đang hoạt động");
});

// Kiểm tra health check cho dịch vụ
app.get("/health", async (req, res) => {
  try {
    // Kiểm tra kết nối database
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: "Hệ thống đang hoạt động bình thường" });
  } catch (error) {
    console.error("Lỗi health check:", error);
    res.status(500).json({ status: "Lỗi kết nối cơ sở dữ liệu" });
  }
});

// Đăng ký routes
app.use(`${API_PREFIX}/users`, userRouter);
app.use(API_PREFIX, roleRequestRouter);
app.use(`${API_PREFIX}/articles`, articleRouter);
app.use(`${API_PREFIX}/admin`, adminRouter);

// Middleware xử lý lỗi 404
app.use((req, res, next) => {
  res.status(404).json({ message: "Không tìm thấy tài nguyên yêu cầu" });
});

// Middleware xử lý lỗi chung
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Đã xảy ra lỗi nội bộ máy chủ";

    console.error(`[ERROR] ${req.method} ${req.path}:`, err);

    res.status(statusCode).json({
      message,
      stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
  }
);

// Khởi động server
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`Server đang chạy trên cổng ${port}`);
});

// Xử lý tắt server đúng cách
process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);

async function shutDown() {
  console.log("Đang tắt server...");
  await prisma.$disconnect();
  server.close(() => {
    console.log("Server đã đóng an toàn");
    process.exit(0);
  });

  // Nếu server không đóng sau 10 giây, buộc tắt
  setTimeout(() => {
    console.error("Không thể đóng kết nối, buộc tắt!");
    process.exit(1);
  }, 10000);
}
