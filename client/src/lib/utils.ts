import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { AuthTokens } from "aws-amplify/auth";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

type AmplifyIdToken = AuthTokens["idToken"];

interface CognitoUser {
  userId: string;
  username: string;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date dưới dạng ngày/tháng/năm
export function formatDate(date: Date | string) {
  return format(new Date(date), "dd/MM/yyyy", { locale: vi });
}

// Format date với thời gian đầy đủ
export function formatDateTime(date: Date | string) {
  return format(new Date(date), "HH:mm - dd/MM/yyyy", { locale: vi });
}

// Cắt bớt nội dung text quá dài và thêm "..." vào cuối
export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

// Tạo slug từ tiêu đề bài viết
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Tạo người dùng mới trong database khi đăng nhập lần đầu
export const createNewUserInDatabase = async (
  cognitoUser: CognitoUser,
  idToken: AmplifyIdToken,
  userRole: string,
  fetchWithBQ: any
) => {
  try {
    const emailFromToken = idToken?.payload?.email as string | undefined;

    const givenName = idToken?.payload?.given_name as string | undefined;
    const middleName = (idToken?.payload?.middle_name ||
      idToken?.payload?.["custom:middle_name"]) as string | undefined;
    const familyName = idToken?.payload?.family_name as string | undefined;
    const genericName = idToken?.payload?.name as string | undefined;

    let constructedName: string | undefined = undefined;

    if (givenName && familyName) {
      const nameParts = [familyName, middleName, givenName];
      constructedName = nameParts.filter(Boolean).join(" ");
    } else if (genericName) {
      constructedName = genericName;
    }

    const avatarFromToken = idToken?.payload?.picture as string | undefined;

    console.log("Utils: Đang tạo người dùng mới trong DB với thông tin:", {
      cognitoId: cognitoUser.userId,
      email: emailFromToken,
      role: userRole,
      name: constructedName,
      avatarUrl: avatarFromToken,
    });

    if (!cognitoUser.userId || !emailFromToken) {
      console.error("Utils: Thiếu cognitoId hoặc email để tạo người dùng.");
      return {
        error: {
          status: 400,
          data: {
            message: "Cần có Cognito ID và email để tạo hồ sơ người dùng.",
          },
        },
      };
    }

    const response = await fetchWithBQ({
      url: "/users",
      method: "POST",
      body: {
        cognitoId: cognitoUser.userId,
        email: emailFromToken,
        role: userRole.toUpperCase(),
        name: constructedName || null,
        avatarUrl: avatarFromToken || null,
      },
    });

    if (response.error) {
      console.error("Utils: API không thể tạo người dùng:", response.error);
      return { error: response.error };
    }

    console.log("Utils: Tạo người dùng thành công qua API:", response.data);
    return response;
  } catch (error: any) {
    console.error(
      "Utils: Lỗi nghiêm trọng trong hàm createNewUserInDatabase:",
      error
    );
    return {
      error: {
        status: 500,
        data: {
          message: error.message || "Lỗi phía client khi tạo người dùng.",
        },
      },
    };
  }
};

// Định dạng số view/like thành dạng K, M nếu lớn
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

// Tạo một ID duy nhất
export function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Xử lý lỗi API
export function handleApiError(error: any): string {
  if (typeof error === "string") return error;

  if (error?.data?.message) return error.data.message;
  if (error?.message) return error.message;

  return "Đã xảy ra lỗi. Vui lòng thử lại sau.";
}
