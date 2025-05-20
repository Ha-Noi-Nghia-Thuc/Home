import { Prisma, Role } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";
import {
  handlePrismaError,
  sendError,
  sendSuccess,
} from "../lib/response.util";

// Schema cho việc tạo người dùng
export const createUserSchema = z.object({
  cognitoId: z.string().min(1, "Cognito ID không được để trống"),
  email: z.string().email("Email không hợp lệ"),
  name: z.string().optional(),
  role: z
    .enum(["USER", "AUTHOR", "ADMIN"], {
      errorMap: () => ({ message: "Vai trò không hợp lệ" }),
    })
    .optional(),
  avatarUrl: z.string().url("URL avatar không hợp lệ").optional().nullable(),
});

// Schema cho việc cập nhật người dùng
export const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Email không hợp lệ").optional(),
  avatarUrl: z.string().url("URL avatar không hợp lệ").optional().nullable(),
  role: z
    .enum(["USER", "AUTHOR", "ADMIN"], {
      errorMap: () => ({ message: "Vai trò không hợp lệ" }),
    })
    .optional(),
});

// Lấy thông tin người dùng theo Cognito ID
export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    if (!cognitoId) {
      sendError(res, { message: "Cognito ID là bắt buộc." });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { cognitoId },
    });

    if (!user) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[WARN] User không tồn tại với cognitoId: ${cognitoId}`);
      }
      sendError(res, { message: "Không tìm thấy người dùng." }, 404);
      return;
    }

    sendSuccess(res, { data: user });
  } catch (error: any) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[ERROR] Lỗi khi lấy người dùng:", error);
    }

    sendError(
      res,
      {
        message: "Đã xảy ra lỗi khi lấy người dùng.",
        meta: { error: error.message },
      },
      500
    );
  }
};

// Tạo người dùng mới
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId, name, email, role, avatarUrl } = req.body;

    // Kiểm tra cognitoId đã tồn tại chưa
    const existingUserByCognitoId = await prisma.user.findUnique({
      where: { cognitoId },
    });

    if (existingUserByCognitoId) {
      sendSuccess(
        res,
        {
          message: "Người dùng với cognitoId này đã tồn tại.",
          data: existingUserByCognitoId,
        },
        200
      );
      return;
    }

    // Kiểm tra email đã tồn tại chưa
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      sendError(
        res,
        {
          message: `Email ${email} đã được sử dụng.`,
          data: existingUserByEmail,
        },
        409
      );
      return;
    }

    // Xác thực role hợp lệ
    const validRoles = Object.values(Role);
    let roleToUse: Role = Role.USER; // Mặc định là USER

    if (role && typeof role === "string") {
      const upperCaseRole = role.toUpperCase();
      if (validRoles.includes(upperCaseRole as Role)) {
        roleToUse = upperCaseRole as Role;
      } else if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[WARN] Role không hợp lệ: ${role}, sẽ dùng mặc định USER`
        );
      }
    }

    // Tạo người dùng mới
    const newUser = await prisma.user.create({
      data: {
        cognitoId,
        email,
        name: name || null,
        avatarUrl: avatarUrl || null,
        role: roleToUse,
      },
    });

    sendSuccess(
      res,
      { message: "Tạo người dùng thành công", data: newUser },
      201
    );
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const target = error.meta?.target as string[] | string | undefined;
      const field = Array.isArray(target) ? target.join(", ") : target;

      if (error.code === "P2002") {
        sendError(
          res,
          {
            message: field
              ? `Trường ${field} đã tồn tại.`
              : "Người dùng đã tồn tại hoặc xung đột với một trường duy nhất.",
          },
          409
        );
        return;
      }
    }

    handlePrismaError(res, error);
  }
};

// Cập nhật thông tin người dùng
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const { name, email, avatarUrl, role } = req.body;

    // Kiểm tra người dùng tồn tại
    const existingUser = await prisma.user.findUnique({
      where: { cognitoId },
    });

    if (!existingUser) {
      sendError(res, { message: "Không tìm thấy người dùng." }, 404);
      return;
    }

    // Kiểm tra email có bị trùng không
    if (email && email !== existingUser.email) {
      const userWithEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (userWithEmail) {
        sendError(
          res,
          {
            message: `Email ${email} đã được sử dụng.`,
            data: userWithEmail,
          },
          409
        );
        return;
      }
    }

    // Xác thực role nếu có cung cấp
    let roleToUse: Role | undefined = undefined;
    if (role && typeof role === "string") {
      const upperCaseRole = role.toUpperCase();
      const validRoles = Object.values(Role);
      if (validRoles.includes(upperCaseRole as Role)) {
        roleToUse = upperCaseRole as Role;
      } else if (process.env.NODE_ENV !== "production") {
        console.warn(`[WARN] Role không hợp lệ: ${role}, giữ nguyên role cũ.`);
      }
    }

    const updateData: Prisma.UserUpdateInput = {
      name: typeof name === "string" ? name : undefined,
      email: typeof email === "string" ? email : undefined,
      avatarUrl: typeof avatarUrl === "string" ? avatarUrl : undefined,
      ...(roleToUse ? { role: roleToUse } : {}),
    };

    const updatedUser = await prisma.user.update({
      where: { cognitoId },
      data: updateData,
    });

    sendSuccess(res, {
      message: "Cập nhật người dùng thành công",
      data: updatedUser,
    });
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const target = error.meta?.target as string[] | string | undefined;
        const field = Array.isArray(target) ? target.join(", ") : target;

        sendError(
          res,
          {
            message: field
              ? `Trường ${field} đã tồn tại.`
              : "Dữ liệu người dùng bị xung đột.",
          },
          409
        );
        return;
      }
    }

    handlePrismaError(res, error);
  }
};
