import { PrismaClient, Role, RoleRequestStatus } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// Gửi yêu cầu nâng cấp quyền lên AUTHOR
export const requestAuthorRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cognitoId = req.user?.id;
    // Xác thực người dùng từ Cognito
    if (!cognitoId) {
      res.status(403).json({ message: "Bạn chưa đăng nhập." });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { cognitoId },
    });
    if (!user) {
      res.status(404).json({ message: "Không tìm thấy người dùng." });
      return;
    }

    // Trường hợp người dùng đã là AUTHOR
    if (user.role === Role.AUTHOR) {
      res.status(400).json({
        message: "Bạn đã có quyền Author.",
      });
      return;
    }

    // Trường hợp ADMIN cố gắng gửi yêu cầu
    if (user.role === Role.ADMIN) {
      res.status(400).json({
        message: "Admin không thể gửi yêu cầu trở thành Author.",
      });
      return;
    }

    // Chỉ cho phép USER gửi yêu cầu
    if (user.role !== Role.USER) {
      res.status(403).json({
        message: "Chỉ người dùng có vai trò USER mới được gửi yêu cầu.",
      });
      return;
    }

    // Kiểm tra xem đã có yêu cầu nào tồn tại chưa
    const existingRequest = await prisma.roleRequest.findFirst({
      where: {
        userId: user.id,
        requestedRole: Role.AUTHOR,
        status: {
          in: [RoleRequestStatus.PENDING, RoleRequestStatus.APPROVED],
        },
      },
    });
    if (existingRequest) {
      const { status } = existingRequest;

      if (status === RoleRequestStatus.PENDING) {
        res.status(409).json({
          message: "Bạn đã gửi yêu cầu và đang chờ phê duyệt.",
        });
        return;
      }

      if (status === RoleRequestStatus.APPROVED) {
        // Có thể xảy ra nếu user chưa được cập nhật role chính thức
        res.status(409).json({
          message: "Yêu cầu của bạn đã được phê duyệt trước đó.",
        });
        return;
      }
    }

    // Tạo yêu cầu mới
    const newRoleRequest = await prisma.roleRequest.create({
      data: {
        userId: user.id,
        requestedRole: Role.AUTHOR,
        status: RoleRequestStatus.PENDING,
      },
    });

    res.status(201).json({
      message:
        "Yêu cầu trở thành Author đã được gửi. Vui lòng chờ admin phê duyệt.",
      data: newRoleRequest,
    });
    return;
  } catch (error: any) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[ERROR] Lỗi khi gửi yêu cầu quyền Author:", error);
    }

    res.status(500).json({
      message: "Lỗi trong quá trình gửi yêu cầu.",
      error: process.env.NODE_ENV !== "production" ? error.message : undefined,
    });
  }
};
