import { NavLink } from "./navbar";
import { AuthUser } from "aws-amplify/auth";
import { Role, User, Post, RoleRequest } from "./prismaTypes";

declare global {
  //=================================
  // Navigation & Layout Types
  //=================================
  interface NavLink {
    href: string;
    label: string;
  }

  interface NavbarProps {
    className?: string;
  }

  interface NavbarUserProps extends NavbarProps {
    userInfo: {
      data: {
        name: string;
        avatarUrl?: string;
        userRole: "USER" | "AUTHOR" | "ADMIN";
      };
    };
  }

  interface NavbarGuestProps extends NavbarProps {}

  interface UserDropdownProps {
    userInfo: NavbarUserProps["userInfo"];
    onSignOut: () => Promise<void>;
  }

  interface AppSidebarProps {
    userRole: "USER" | "AUTHOR" | "ADMIN";
    isLoading?: boolean;
  }

  // Define AppUser interface
  interface AppUser {
    cognitoInfo: any;
    userInfo: User;
    userRole: Role;
  }

  interface AuthUserResponse {
    cognitoInfo: any;
    userInfo: User;
    userRole: string;
  }

  interface RoleRequestResponse {
    id: string;
    userId: string;
    roleRequested: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }

  interface SettingsFormProps {
    initialData: SettingsFormData;
    onSubmit: (data: SettingsFormData) => Promise<void>;
    userType: Role;
    onRequestAuthor?: () => Promise<void>;
    isRequestingAuthor?: boolean;
    roleRequests?: RoleRequestResponse[];
  }

  interface ArticleFormData {
    title: string;
    content: string;
    excerpt?: string;
    coverImageUrl?: string;
    published?: boolean;
    categoryIds?: string[];
    tagIds?: string[];
    slug?: string;
  }

  interface ArticleCardProps {
    article: {
      id: string;
      title: string;
      excerpt?: string;
      coverImageUrl?: string;
      publishedAt?: string;
      featured?: boolean;
      author?: {
        name?: string;
        avatarUrl?: string;
      };
      category?: string;
    };
    onClick?: () => void;
  }
}

export {};
