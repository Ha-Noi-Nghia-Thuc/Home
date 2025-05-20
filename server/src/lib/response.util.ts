import { Prisma } from "@prisma/client";
import { Response } from "express";

interface ResponseOptions {
  message?: string;
  data?: any;
  meta?: any;
}

// Hàm tạo API response thành công
export const sendSuccess = (
  res: Response,
  options: ResponseOptions = {},
  statusCode = 200
): void => {
  const { message, data, meta } = options;

  const response: any = {
    success: true,
  };

  if (message) response.message = message;
  if (data !== undefined) response.data = data;
  if (meta !== undefined) response.meta = meta;

  res.status(statusCode).json(response);
};

// Hàm tạo API response lỗi
export const sendError = (
  res: Response,
  options: ResponseOptions = {},
  statusCode = 400
): void => {
  const { message = "Đã xảy ra lỗi", data, meta } = options;

  const response: any = {
    success: false,
    message,
  };

  if (data !== undefined) response.data = data;
  if (meta !== undefined) response.meta = meta;

  if (process.env.NODE_ENV !== "production" && meta?.error) {
    console.error(`[ERROR] ${message}:`, meta.error);
  }

  res.status(statusCode).json(response);
};

// Hàm xử lý lỗi Prisma
export const handlePrismaError = (res: Response, error: any): void => {
  console.error("[PRISMA ERROR]", error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002": {
        // Lỗi ràng buộc unique
        const target = error.meta?.target as string[] | string | undefined;
        const field = Array.isArray(target) ? target.join(", ") : target;

        sendError(
          res,
          {
            message: field
              ? `Trường ${field} đã tồn tại.`
              : "Dữ liệu đã tồn tại hoặc xung đột với một trường duy nhất.",
            meta: { code: error.code, fields: target },
          },
          409
        );
        return;
      }

      case "P2003": {
        // Lỗi ràng buộc khóa ngoại
        sendError(
          res,
          {
            message: "Dữ liệu tham chiếu không tồn tại.",
            meta: { code: error.code, fields: error.meta?.field_name },
          },
          400
        );
        return;
      }

      case "P2025": {
        // Bản ghi không tồn tại
        sendError(
          res,
          {
            message: "Không tìm thấy dữ liệu yêu cầu.",
            meta: { code: error.code },
          },
          404
        );
        return;
      }

      default:
        sendError(
          res,
          {
            message: "Lỗi cơ sở dữ liệu.",
            meta: { code: error.code },
          },
          400
        );
        return;
    }
  }

  // Lỗi không xác định
  sendError(
    res,
    {
      message: "Đã xảy ra lỗi hệ thống.",
      meta: {
        error:
          process.env.NODE_ENV !== "production" ? error.message : undefined,
      },
    },
    500
  );
};
