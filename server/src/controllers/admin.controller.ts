import { Prisma, PrismaClient, RoleRequestStatus } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

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

    res.json(requests);
  } catch (error: any) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "Admin Controller: Lỗi khi lấy danh sách role requests:",
        error
      );
    }

    res.status(500).json({
      message: "Không thể lấy danh sách yêu cầu nâng quyền.",
      error: process.env.NODE_ENV !== "production" ? error.message : undefined,
    });
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
      res.status(404).json({ message: "Không tìm thấy yêu cầu." });
      return;
    }
    if (roleRequest.status !== RoleRequestStatus.PENDING) {
      res.status(400).json({
        message: `Yêu cầu không ở trạng thái PENDING. Trạng thái hiện tại: ${roleRequest.status}.`,
      });
      return;
    }

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

    res.json({
      message: "Phê duyệt quyền thành công.",
      roleRequest: updatedRequest,
      user: {
        id: updatedUser.id,
        role: updatedUser.role,
      },
    });
  } catch (error: any) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Admin Controller: Lỗi khi phê duyệt yêu cầu:", error);
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      res.status(404).json({
        message: "Người dùng liên kết với yêu cầu không tồn tại.",
      });
      return;
    }

    res.status(500).json({
      message: "Không thể phê duyệt yêu cầu nâng quyền.",
      error: process.env.NODE_ENV !== "production" ? error.message : undefined,
    });
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
      res.status(404).json({ message: "Không tìm thấy yêu cầu." });
      return;
    }
    if (roleRequest.status !== RoleRequestStatus.PENDING) {
      res.status(400).json({
        message: `Yêu cầu không ở trạng thái PENDING. Trạng thái hiện tại: ${roleRequest.status}.`,
      });
      return;
    }

    const updatedRequest = await prisma.roleRequest.update({
      where: { id: requestId },
      data: { status: RoleRequestStatus.DENIED },
    });

    res.json({
      message: "Từ chối yêu cầu thành công.",
      roleRequest: updatedRequest,
    });
  } catch (error: any) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Admin Controller: Lỗi khi từ chối yêu cầu:", error);
    }

    res.status(500).json({
      message: "Không thể từ chối yêu cầu nâng quyền.",
      error: process.env.NODE_ENV !== "production" ? error.message : undefined,
    });
  }
};
