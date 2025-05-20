import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { sendError } from "../lib/response.util";

// Interface mở rộng cho token được giải mã
interface DecodedToken extends JwtPayload {
  sub: string;
  "custom:role"?: string;
  email?: string;
  name?: string;
}

// Mở rộng kiểu Request của Express để hỗ trợ thông tin người dùng
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        email?: string;
        name?: string;
      };
    }
  }
}

// Middleware xác thực người dùng
export const authMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Lấy token từ header Authorization
    const token = req.headers.authorization?.split(" ")[1];

    // Đường dẫn tạo người dùng
    const createUserPath = process.env.API_PREFIX
      ? `${process.env.API_PREFIX}/users`
      : "/users";

    // Kiểm tra token tồn tại
    if (!token) {
      sendError(res, { message: "Không có quyền truy cập - Thiếu token" }, 401);
      return;
    }

    try {
      // Giải mã token
      const decoded = jwt.decode(token) as DecodedToken | null;

      // Kiểm tra token hợp lệ
      if (!decoded || !decoded.sub) {
        sendError(
          res,
          { message: "Token không hợp lệ hoặc sai định dạng" },
          400
        );
        return;
      }

      // Lấy vai trò từ token
      const userRoleFromToken = (
        (decoded["custom:role"] as string) || "USER"
      ).toUpperCase();

      // Gán thông tin người dùng vào request
      req.user = {
        id: decoded.sub,
        role: userRoleFromToken,
        email: decoded.email,
        name: decoded.name,
      };

      // Cho phép tạo user mới
      if (req.method === "POST" && req.originalUrl.endsWith(createUserPath)) {
        next();
        return;
      }

      // Kiểm tra quyền truy cập
      const hasAccess = allowedRoles.some(
        (role) => role.toUpperCase() === userRoleFromToken
      );

      if (!hasAccess) {
        sendError(
          res,
          {
            message:
              "Truy cập bị từ chối: Bạn không có quyền thực hiện hành động này",
          },
          403
        );
        return;
      }

      next();
    } catch (err: any) {
      if (process.env.NODE_ENV !== "production") {
        console.error("[ERROR] Lỗi xác thực:", err);
      }

      if (
        err.name === "JsonWebTokenError" ||
        err.name === "TokenExpiredError"
      ) {
        sendError(
          res,
          { message: `Token không hợp lệ hoặc đã hết hạn: ${err.message}` },
          401
        );
      } else {
        sendError(res, { message: "Lỗi xác thực" }, 400);
      }
      return;
    }
  };
};

// Middleware kiểm tra người dùng đã đăng nhập
export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    sendError(res, { message: "Không có quyền truy cập - Thiếu token" }, 401);
    return;
  }

  try {
    const decoded = jwt.decode(token) as DecodedToken | null;

    if (!decoded || !decoded.sub) {
      sendError(res, { message: "Token không hợp lệ hoặc sai định dạng" }, 400);
      return;
    }

    const userRoleFromToken = (
      (decoded["custom:role"] as string) || "USER"
    ).toUpperCase();

    req.user = {
      id: decoded.sub,
      role: userRoleFromToken,
      email: decoded.email,
      name: decoded.name,
    };

    next();
  } catch (err: any) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[ERROR] Lỗi xác thực:", err);
    }

    sendError(res, { message: "Lỗi xác thực người dùng" }, 401);
    return;
  }
};
