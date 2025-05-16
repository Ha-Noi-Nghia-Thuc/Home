import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { AuthTokens } from "aws-amplify/auth";

type AmplifyIdToken = AuthTokens["idToken"];

interface CognitoUser {
  userId: string;
  username: string;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

    console.log("Utils: Attempting to create new user in DB with payload:", {
      cognitoId: cognitoUser.userId,
      email: emailFromToken,
      role: userRole,
      name: constructedName,
      avatarUrl: avatarFromToken,
    });

    if (!cognitoUser.userId || !emailFromToken) {
      console.error("Utils: Missing cognitoId or email for creating user.");
      return {
        error: {
          status: 400,
          data: {
            message:
              "Cognito ID and email are required to create a user profile.",
          },
        },
      };
    }

    const response = await fetchWithBQ({
      url: "/user",
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
      console.error("Utils: API failed to create user:", response.error);
      return { error: response.error };
    }

    console.log("Utils: User created successfully via API:", response.data);
    return response;
  } catch (error: any) {
    console.error(
      "Utils: Critical error in createNewUserInDatabase function:",
      error
    );
    return {
      error: {
        status: 500,
        data: {
          message: error.message || "Client-side error during user creation.",
        },
      },
    };
  }
};
