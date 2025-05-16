import { Request, Response } from "express";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cognitoId } = req.params;

    if (!cognitoId) {
      res
        .status(400)
        .json({ message: "Cognito ID is required in path parameter." });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { cognitoId },
    });

    if (!user) {
      console.log(`Controller: User with cognitoId ${cognitoId} not found.`);
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (error: any) {
    console.error("Controller: Error retrieving user:", error);
    res
      .status(500)
      .json({ message: "Error retrieving user", error: error.message });
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId, name, email, role, avatarUrl } = req.body;

    if (!cognitoId || !email) {
      console.log("Controller: Missing required fields for user creation:", {
        cognitoId,
        email,
      });
      res.status(400).json({ message: "cognitoId and email are required" });
      return;
    }

    const existingUserByCognitoId = await prisma.user.findUnique({
      where: { cognitoId },
    });

    if (existingUserByCognitoId) {
      res.status(409).json({
        message: "User with this cognitoId already exists",
        data: existingUserByCognitoId,
      });
      return;
    }

    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      res.status(409).json({
        message: `An account with email ${email} already exists.`,
        data: existingUserByEmail,
      });
      return;
    }

    const validRoles = Object.values(Role);
    let roleToUse: Role = Role.USER;

    if (role && typeof role === "string") {
      const upperCaseRole = role.toUpperCase();
      if (validRoles.includes(upperCaseRole as Role)) {
        roleToUse = upperCaseRole as Role;
      } else {
        console.warn(
          `Controller: Invalid role '${role}' provided. Defaulting to USER.`
        );
      }
    }

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
    console.error("Controller: Error creating user in database:", error);
    if (error.code === "P2002") {
      const target = error.meta?.target as string[] | string | undefined;
      const field = Array.isArray(target) ? target.join(", ") : target;
      console.error(
        `Controller: Unique constraint failed on field(s): ${field}`
      );
      const message = field
        ? `An account with this ${field} already exists.`
        : "User already exists or a unique field conflicts.";
      res.status(409).json({ message });
    } else {
      res
        .status(500)
        .json({ message: "Error creating user", error: error.message });
    }
  }
};
