import { Request, Response } from "express";
import { Prisma, PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

// Lấy thông tin người dùng theo Cognito ID
export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    if (!cognitoId) {
      res.status(400).json({ message: "Cognito ID là bắt buộc." });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { cognitoId },
    });
    if (!user) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[WARN] User không tồn tại với cognitoId: ${cognitoId}`);
      }
      res.status(404).json({ message: "Không tìm thấy người dùng." });
      return;
    }

    res.json(user);
  } catch (error: any) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[ERROR] Lỗi khi lấy người dùng:", error);
    }

    res.status(500).json({
      message: "Đã xảy ra lỗi khi lấy người dùng.",
      error: process.env.NODE_ENV !== "production" ? error.message : undefined,
    });
  }
};

// Tạo người dùng mới
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId, name, email, role, avatarUrl } = req.body;
    if (!cognitoId || !email) {
      res.status(400).json({
        message: "cognitoId và email là bắt buộc.",
      });
      return;
    }

    // Kiểm tra cognitoId đã tồn tại chưa
    const existingUserByCognitoId = await prisma.user.findUnique({
      where: { cognitoId },
    });
    if (existingUserByCognitoId) {
      res.status(409).json({
        message: "Người dùng với cognitoId này đã tồn tại.",
        data: existingUserByCognitoId,
      });
      return;
    }

    // Kiểm tra email đã tồn tại chưa
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUserByEmail) {
      res.status(409).json({
        message: `Email ${email} đã được sử dụng.`,
        data: existingUserByEmail,
      });
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

    res.status(201).json(newUser);
  } catch (error: any) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[ERROR] Lỗi khi tạo người dùng:", error);
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const target = error.meta?.target as string[] | string | undefined;
      const field = Array.isArray(target) ? target.join(", ") : target;
      res.status(409).json({
        message: field
          ? `Trường ${field} đã tồn tại.`
          : "Người dùng đã tồn tại hoặc xung đột với một trường duy nhất.",
      });
      return;
    }

    res.status(500).json({
      message: "Lỗi khi tạo người dùng.",
      error: process.env.NODE_ENV !== "production" ? error.message : undefined,
    });
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
    if (!cognitoId) {
      res.status(400).json({ message: "Cognito ID là bắt buộc." });
      return;
    }

    // Kiểm tra người dùng tồn tại
    const existingUser = await prisma.user.findUnique({
      where: { cognitoId },
    });
    if (!existingUser) {
      res.status(404).json({ message: "Không tìm thấy người dùng." });
      return;
    }

    // Kiểm tra email có bị trùng không
    if (email && email !== existingUser.email) {
      const userWithEmail = await prisma.user.findUnique({
        where: { email },
      });
      if (userWithEmail) {
        res.status(409).json({
          message: `Email ${email} đã được sử dụng.`,
          data: userWithEmail,
        });
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

    res.json(updatedUser);
  } catch (error: any) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[ERROR] Lỗi khi cập nhật người dùng:", error);
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const target = error.meta?.target as string[] | string | undefined;
      const field = Array.isArray(target) ? target.join(", ") : target;
      res.status(409).json({
        message: field
          ? `Trường ${field} đã tồn tại.`
          : "Người dùng đã tồn tại hoặc xung đột với một trường duy nhất.",
      });
      return;
    }

    res.status(500).json({
      message: "Lỗi khi cập nhật người dùng.",
      error: process.env.NODE_ENV !== "production" ? error.message : undefined,
    });
  }
};
