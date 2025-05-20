import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { sendError } from "../lib/response.util";

// Tạo middleware kiểm tra tính hợp lệ của dữ liệu request
export const validate = (
  schema: z.ZodType<any>,
  source: "body" | "query" | "params" = "body"
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Áp dụng schema validation
      const result = schema.safeParse(req[source]);

      if (!result.success) {
        // Xử lý lỗi zod
        const errors = result.error.errors.map((err: z.ZodIssue) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        sendError(
          res,
          {
            message: "Dữ liệu không hợp lệ",
            data: { errors },
          },
          400
        );
        return;
      }

      // Gán dữ liệu đã được validate vào req
      req[source] = result.data;
      next();
    } catch (error: any) {
      sendError(
        res,
        {
          message: "Lỗi xác thực dữ liệu",
          meta: { error: error.message },
        },
        400
      );
      return;
    }
  };
};

// Middleware kiểm tra ID hợp lệ từ params
export const validateId = validate(
  z.object({
    id: z.string().min(1, "ID không được để trống"),
  }),
  "params"
);

// Middleware kiểm tra Cognito ID hợp lệ từ params
export const validateCognitoId = validate(
  z.object({
    cognitoId: z.string().min(1, "Cognito ID không được để trống"),
  }),
  "params"
);
