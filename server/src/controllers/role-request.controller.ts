import { Role, RoleRequestStatus } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";
import {
  handlePrismaError,
  sendError,
  sendSuccess,
} from "../lib/response.util";

// Schema cho việc tạo yêu cầu quyền
export const createRoleRequestSchema = z.object({
  reason: z.string().min(10, "Lý do phải có ít nhất 10 ký tự").optional(),
});

// Gửi yêu cầu nâng cấp quyền lên AUTHOR
export const requestAuthorRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { reason } = req.body;
    const cognitoId = req.user?.id;

    // Xác thực người dùng từ Cognito
    if (!cognitoId) {
      sendError(res, { message: "Bạn chưa đăng nhập." }, 403);
      return;
    }

    const user = await prisma.user.findUnique({
      where: { cognitoId },
    });

    if (!user) {
      sendError(res, { message: "Không tìm thấy người dùng." }, 404);
      return;
    }

    // Trường hợp người dùng đã là AUTHOR
    if (user.role === Role.AUTHOR) {
      sendError(res, { message: "Bạn đã có quyền Author." }, 400);
      return;
    }

    // Trường hợp ADMIN cố gắng gửi yêu cầu
    if (user.role === Role.ADMIN) {
      sendError(
        res,
        { message: "Admin không thể gửi yêu cầu trở thành Author." },
        400
      );
      return;
    }

    // Chỉ cho phép USER gửi yêu cầu
    if (user.role !== Role.USER) {
      sendError(
        res,
        { message: "Chỉ người dùng có vai trò USER mới được gửi yêu cầu." },
        403
      );
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
        sendError(
          res,
          { message: "Bạn đã gửi yêu cầu và đang chờ phê duyệt." },
          409
        );
        return;
      }

      if (status === RoleRequestStatus.APPROVED) {
        // Có thể xảy ra nếu user chưa được cập nhật role chính thức
        sendError(
          res,
          { message: "Yêu cầu của bạn đã được phê duyệt trước đó." },
          409
        );
        return;
      }
    }

    // Tạo yêu cầu mới
    const newRoleRequest = await prisma.roleRequest.create({
      data: {
        userId: user.id,
        requestedRole: Role.AUTHOR,
        status: RoleRequestStatus.PENDING,
        reason: reason || null,
      },
    });

    sendSuccess(
      res,
      {
        message:
          "Yêu cầu trở thành Author đã được gửi. Vui lòng chờ admin phê duyệt.",
        data: newRoleRequest,
      },
      201
    );
  } catch (error: any) {
    handlePrismaError(res, error);
  }
};

// Lấy danh sách các yêu cầu nâng cấp quyền của người dùng hiện tại
export const getMyRoleRequests = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cognitoId = req.user?.id;

    if (!cognitoId) {
      sendError(res, { message: "Bạn chưa đăng nhập." }, 403);
      return;
    }

    const user = await prisma.user.findUnique({
      where: { cognitoId },
    });

    if (!user) {
      sendError(res, { message: "Không tìm thấy người dùng." }, 404);
      return;
    }

    const requests = await prisma.roleRequest.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    sendSuccess(res, { data: requests });
  } catch (error: any) {
    handlePrismaError(res, error);
  }
};

// Hủy yêu cầu nâng cấp quyền (chỉ cho phép hủy yêu cầu đang trong trạng thái PENDING)
export const cancelRoleRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { requestId } = req.params;
    const cognitoId = req.user?.id;

    if (!cognitoId) {
      sendError(res, { message: "Bạn chưa đăng nhập." }, 403);
      return;
    }

    const user = await prisma.user.findUnique({
      where: { cognitoId },
    });

    if (!user) {
      sendError(res, { message: "Không tìm thấy người dùng." }, 404);
      return;
    }

    // Tìm yêu cầu cần hủy
    const roleRequest = await prisma.roleRequest.findFirst({
      where: {
        id: requestId,
        userId: user.id,
        status: RoleRequestStatus.PENDING,
      },
    });

    if (!roleRequest) {
      sendError(
        res,
        { message: "Không tìm thấy yêu cầu hoặc yêu cầu không thể hủy." },
        404
      );
      return;
    }

    // Xóa yêu cầu
    await prisma.roleRequest.delete({
      where: { id: requestId },
    });

    sendSuccess(res, { message: "Đã hủy yêu cầu nâng cấp quyền." });
  } catch (error: any) {
    handlePrismaError(res, error);
  }
};
