import { AuthUser } from "aws-amplify/auth";
import { Role, User } from "./prismaTypes";

declare global {
  // Define AppUser interface
  interface AppUser {
    cognitoInfo: any;
    databaseInfo: User;
    userRole: Role;
  }

  interface AuthUserResponse {
    cognitoInfo: any;
    userInfo: User | undefined;
    userRole: string | undefined;
  }

  interface AppSidebarProps {
    userType: Role;
  }

  interface SettingsFormProps {
    initialData: SettingsFormData;
    onSubmit: (data: SettingsFormData) => Promise<void>;
    userType: Role;
    onRequestAuthor?: () => Promise<void>;
    isRequestingAuthor?: boolean;
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
    };
    onClick?: () => void;
  }
}

export {};
