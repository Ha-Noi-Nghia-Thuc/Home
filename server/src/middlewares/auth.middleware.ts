import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  sub: string;
  "custom:role"?: string;
  email?: string;
  name?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        email?: string;
      };
    }
  }
}

export const authMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(" ")[1];

    const createUserPath = process.env.API_PREFIX
      ? `${process.env.API_PREFIX}/user`
      : "/user";

    if (!token) {
      res.status(401).json({ message: "Unauthorized - No token provided" });
      return;
    }

    try {
      const decoded = jwt.decode(token) as DecodedToken | null;

      if (!decoded || !decoded.sub) {
        res.status(400).json({ message: "Invalid or malformed token" });
        return;
      }

      const userRoleFromToken = (
        (decoded["custom:role"] as string) || "USER"
      ).toUpperCase();
      req.user = {
        id: decoded.sub,
        role: userRoleFromToken,
        email: decoded.email,
      };

      if (req.method === "POST" && req.originalUrl.endsWith(createUserPath)) {
        next();
        return;
      }

      const hasAccess = allowedRoles.some(
        (role) => role.toUpperCase() === userRoleFromToken
      );
      if (!hasAccess) {
        res
          .status(403)
          .json({ message: "Access Denied: Insufficient permissions" });
        return;
      }

      next();
    } catch (err: any) {
      if (
        err.name === "JsonWebTokenError" ||
        err.name === "TokenExpiredError"
      ) {
        res
          .status(401)
          .json({ message: `Invalid or expired token: ${err.message}` });
      } else {
        res.status(400).json({ message: "Authentication error" });
      }
      return;
    }
  };
};
