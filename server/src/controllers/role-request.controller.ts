import { PrismaClient, Role, RoleRequestStatus } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const requestAuthorRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cognitoId = req.user?.id;
    if (!cognitoId) {
      res.status(403).json({ message: "User not authenticated correctly." });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { cognitoId },
    });
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    if (user.role === Role.AUTHOR) {
      res.status(400).json({ message: "You are already an Author." });
      return;
    }

    if (user.role === Role.ADMIN) {
      res.status(400).json({ message: "Admins cannot request Author role." });
      return;
    }

    if (user.role !== Role.USER) {
      res.status(403).json({
        message: "Only users with USER role can request to become an Author.",
      });
      return;
    }

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
      if (existingRequest.status === RoleRequestStatus.PENDING) {
        res.status(409).json({
          message: "You already have a pending request to become an Author.",
        });
      } else if (existingRequest.status === RoleRequestStatus.APPROVED) {
        // Điều này không nên xảy ra nếu logic đồng bộ vai trò là chính xác, nhưng vẫn kiểm tra
        res.status(409).json({
          message:
            "Your request to become an Author has already been approved.",
        });
      }
      return;
    }

    const newRoleRequest = await prisma.roleRequest.create({
      data: {
        userId: user.id,
        requestedRole: Role.AUTHOR,
        status: RoleRequestStatus.PENDING,
      },
    });

    res.status(201).json({
      message:
        "Request to become an Author submitted successfully. Please wait for admin approval.",
      data: newRoleRequest,
    });
  } catch (error: any) {
    console.error("Controller: Error requesting author role:", error);
    res.status(500).json({
      message: "Error submitting role request.",
      error: error.message,
    });
  }
};
