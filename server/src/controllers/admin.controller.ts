import { Prisma, RoleRequestStatus } from "@prisma/client";
import { Request, Response } from "express";
import prisma from "../lib/prisma";
import {
  sendSuccess,
  sendError,
  handlePrismaError,
} from "../lib/response.util";
import { z } from "zod";

// Schema xác thực tham số cho lọc yêu cầu
export const roleRequestQuerySchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "DENIED"]).optional(),
});

// Lấy danh sách các yêu cầu nâng quyền, có thể lọc theo trạng thái
export const getRoleRequests = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status } = req.query;

    let whereCondition: Prisma.RoleRequestWhereInput = {};
    // Kiểm tra và gán điều kiện lọc theo status nếu hợp lệ
    if (
      status &&
      typeof status === "string" &&
      Object.values(RoleRequestStatus).includes(
        status.toUpperCase() as RoleRequestStatus
      )
    ) {
      whereCondition.status = status.toUpperCase() as RoleRequestStatus;
    }

    const requests = await prisma.roleRequest.findMany({
      where: whereCondition,
      include: {
        user: {
          select: {
            id: true,
            cognitoId: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    sendSuccess(res, { data: requests });
  } catch (error: any) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "Admin Controller: Lỗi khi lấy danh sách role requests:",
        error
      );
    }

    sendError(
      res,
      {
        message: "Không thể lấy danh sách yêu cầu nâng quyền.",
        meta: { error: error.message },
      },
      500
    );
  }
};

// Phê duyệt yêu cầu nâng quyền
export const approveRoleRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { requestId } = req.params;

    const roleRequest = await prisma.roleRequest.findUnique({
      where: { id: requestId },
    });

    if (!roleRequest) {
      sendError(res, { message: "Không tìm thấy yêu cầu." }, 404);
      return;
    }

    if (roleRequest.status !== RoleRequestStatus.PENDING) {
      sendError(
        res,
        {
          message: `Yêu cầu không ở trạng thái PENDING. Trạng thái hiện tại: ${roleRequest.status}.`,
        },
        400
      );
      return;
    }

    // Thực hiện transaction để đảm bảo tính nhất quán dữ liệu
    const [updatedRequest, updatedUser] = await prisma.$transaction(
      async (tx) => {
        const req = await tx.roleRequest.update({
          where: { id: requestId },
          data: { status: RoleRequestStatus.APPROVED },
        });

        const user = await tx.user.update({
          where: { id: roleRequest.userId },
          data: { role: roleRequest.requestedRole },
        });

        return [req, user];
      }
    );

    sendSuccess(res, {
      message: "Phê duyệt quyền thành công.",
      data: {
        roleRequest: updatedRequest,
        user: {
          id: updatedUser.id,
          role: updatedUser.role,
        },
      },
    });
  } catch (error: any) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      sendError(
        res,
        {
          message: "Người dùng liên kết với yêu cầu không tồn tại.",
        },
        404
      );
      return;
    }

    handlePrismaError(res, error);
  }
};

// Từ chối yêu cầu nâng quyền
export const denyRoleRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { requestId } = req.params;

    const roleRequest = await prisma.roleRequest.findUnique({
      where: { id: requestId },
    });

    if (!roleRequest) {
      sendError(res, { message: "Không tìm thấy yêu cầu." }, 404);
      return;
    }

    if (roleRequest.status !== RoleRequestStatus.PENDING) {
      sendError(
        res,
        {
          message: `Yêu cầu không ở trạng thái PENDING. Trạng thái hiện tại: ${roleRequest.status}.`,
        },
        400
      );
      return;
    }

    const updatedRequest = await prisma.roleRequest.update({
      where: { id: requestId },
      data: { status: RoleRequestStatus.DENIED },
    });

    sendSuccess(res, {
      message: "Từ chối yêu cầu thành công.",
      data: { roleRequest: updatedRequest },
    });
  } catch (error: any) {
    handlePrismaError(res, error);
  }
};
