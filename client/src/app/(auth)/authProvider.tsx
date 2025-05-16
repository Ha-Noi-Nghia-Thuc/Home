"use client";

import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import {
  Authenticator,
  Heading,
  useAuthenticator,
  View,
} from "@aws-amplify/ui-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/loading-spinner";

// Validate environment variables
const userPoolId = process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID;
const clientId = process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID;
if (!userPoolId || !clientId) {
  throw new Error(
    "Missing AWS Cognito environment variables. Check .env file."
  );
}

// Configure AWS Amplify for authentication
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId,
      userPoolClientId: clientId,
    },
  },
});

// Custom components for SignIn and SignUp screens
const components = {
  SignIn: {
    Header() {
      return (
        <View className="mt-4 mb-7">
          <Heading level={3} className="text-2xl font-heading font-bold">
            Hà Nội Nghĩa Thục
          </Heading>
          <p className="text-muted-foreground mt-2">
            <span className="font-bold">Chào mừng bạn!</span> Đăng nhập để khám
            phá.
          </p>
        </View>
      );
    },
    Footer() {
      const { toSignUp } = useAuthenticator();
      return (
        <View className="text-center mt-4">
          <p className="text-muted-foreground">
            Chưa có tài khoản?{" "}
            <button
              type="button"
              onClick={toSignUp}
              className="text-primary hover:underline bg-transparent border-none p-0"
              aria-label="Chuyển sang đăng ký"
            >
              Đăng ký
            </button>
          </p>
        </View>
      );
    },
  },
  SignUp: {
    Header() {
      return (
        <View className="mt-4 mb-7">
          <Heading level={3} className="text-2xl font-heading font-bold">
            Hà Nội Nghĩa Thục
          </Heading>
          <p className="text-muted-foreground mt-2">
            <span className="font-bold">Chào mừng bạn!</span> Đăng ký để khám
            phá.
          </p>
        </View>
      );
    },
    Footer() {
      const { toSignIn } = useAuthenticator();
      return (
        <View className="text-center mt-4">
          <p className="text-muted-foreground">
            Đã có tài khoản?{" "}
            <button
              type="button"
              onClick={toSignIn}
              className="text-primary hover:underline bg-transparent border-none p-0"
              aria-label="Chuyển sang đăng nhập"
            >
              Đăng nhập
            </button>
          </p>
        </View>
      );
    },
  },
};

// Form field configurations for SignIn and SignUp
const formFields = {
  signIn: {
    username: {
      placeholder: "Nhập email",
      label: "Email",
      type: "email",
      isRequired: true,
    },
    password: {
      placeholder: "Nhập mật khẩu",
      label: "Mật khẩu",
      isRequired: true,
    },
  },
  signUp: {
    email: {
      order: 1,
      placeholder: "Nhập email",
      label: "Email",
      isRequired: true,
    },
    family_name: {
      order: 2,
      placeholder: "Nhập họ",
      label: "Họ",
      isRequired: true,
    },
    middle_name: {
      order: 3,
      placeholder: "Nhập tên đệm",
      label: "Tên đệm",
      isRequired: true,
    },
    given_name: {
      order: 4,
      placeholder: "Nhập tên",
      label: "Tên",
      isRequired: true,
    },
    password: {
      order: 5,
      placeholder: "Nhập mật khẩu",
      label: "Mật khẩu",
      isRequired: true,
    },
    confirm_password: {
      order: 6,
      placeholder: "Xác nhận mật khẩu",
      label: "Xác nhận mật khẩu",
      isRequired: true,
    },
  },
};

// Auth component to handle authentication logic
const Auth = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  const authPages = ["/sign-in", "/sign-up"];
  const isAuthPage = authPages.includes(pathname);

  useEffect(() => {
    if (user && isAuthPage) {
      router.replace("/"); // Use replace to prevent back navigation to auth page
    } else {
      setLoading(false);
    }
  }, [user, isAuthPage, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="h-full flex items-center justify-center py-8">
      <div className="w-full max-w-md bg-background rounded-xl shadow-lg p-6 border border-border">
        <Authenticator
          initialState={pathname.includes("sign-up") ? "signUp" : "signIn"}
          loginMechanisms={["email"]}
          components={components}
          formFields={formFields}
        >
          {() => <>{children}</>}
        </Authenticator>
      </div>
    </div>
  );
};
export default Auth;
