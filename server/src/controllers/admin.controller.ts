import { Prisma, PrismaClient, RoleRequestStatus } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getRoleRequests = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status } = req.query;
    let whereCondition: Prisma.RoleRequestWhereInput = {};
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
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(requests);
  } catch (error: any) {
    console.error("Controller (Admin): Error fetching role requests:", error);
    res
      .status(500)
      .json({ message: "Error fetching role requests.", error: error.message });
  }
};

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
      res.status(404).json({ message: "Role request not found." });
      return;
    }
    if (roleRequest.status !== RoleRequestStatus.PENDING) {
      res.status(400).json({
        message: `Request is not PENDING, current status: ${roleRequest.status}.`,
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
      message: "Role request approved successfully.",
      roleRequest: updatedRequest,
      user: { id: updatedUser.id, role: updatedUser.role },
    });
  } catch (error: any) {
    console.error("Controller (Admin): Error approving role request:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Ví dụ: người dùng không còn tồn tại
      if (error.code === "P2025") {
        res.status(404).json({
          message:
            "User associated with the request not found. Cannot approve.",
        });
        return;
      }
    }
    res
      .status(500)
      .json({ message: "Error approving role request.", error: error.message });
  }
};

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
      res.status(404).json({ message: "Role request not found." });
      return;
    }

    if (roleRequest.status !== RoleRequestStatus.PENDING) {
      res
        .status(400)
        .json({
          message: `Request is not PENDING, current status: ${roleRequest.status}.`,
        });
      return;
    }

    const updatedRequest = await prisma.roleRequest.update({
      where: { id: requestId },
      data: { status: RoleRequestStatus.DENIED },
    });

    res.json({
      message: "Role request denied successfully.",
      roleRequest: updatedRequest,
    });
  } catch (error: any) {
    console.error("Controller (Admin): Error denying role request:", error);
    res
      .status(500)
      .json({ message: "Error denying role request.", error: error.message });
  }
};
