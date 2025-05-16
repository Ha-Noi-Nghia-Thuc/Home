import { AuthUser } from "aws-amplify/auth";
import { Role, User } from "./prismaTypes";

declare global {
  // Define AppUser interface
  interface AppUser {
    cognitoInfo: any;
    databaseInfo: User;
    userRole: Role;
  }

  interface AppSidebarProps {
    userType: "ADMIN" | "AUTHOR" | "USER" | string;
  }
}

export {};
