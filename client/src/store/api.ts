import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { createNewUserInDatabase } from "@/lib/utils";
import { User } from "@/types/prismaTypes";

export interface AuthUserResponse {
  cognitoInfo: any;
  userInfo: User | undefined;
  userRole: string | undefined;
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      try {
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken;
        if (idToken) {
          headers.set("Authorization", `Bearer ${idToken.toString()}`);
        }
      } catch (error) {
        console.error("Error fetching auth session for headers:", error);
      }
      return headers;
    },
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getAuthUser: builder.query<AuthUserResponse, void>({
      queryFn: async (_, _queryApi, _extraOptions, fetchWithBQ) => {
        try {
          const cognitoAuthUser = await getCurrentUser();
          const session = await fetchAuthSession();
          const idToken = session.tokens?.idToken;

          if (!cognitoAuthUser?.userId || !idToken) {
            return {
              error: {
                status: 401,
                data: "User not authenticated or session expired",
              },
            };
          }

          const cognitoId = cognitoAuthUser.userId;
          const userRoleFromToken = idToken.payload?.["custom:role"] as
            | string
            | undefined;

          let userDetailsResponse = await fetchWithBQ(`/user/${cognitoId}`);
          let dbUser: User | undefined = userDetailsResponse.data as
            | User
            | undefined;

          if (
            userDetailsResponse.error &&
            (userDetailsResponse.error as any).status === 404
          ) {
            const createUserAttempt = await createNewUserInDatabase(
              cognitoAuthUser,
              idToken,
              userRoleFromToken || "USER",
              fetchWithBQ
            );

            if (createUserAttempt.error) {
              return {
                error: {
                  status: (createUserAttempt.error as any).status || 500,
                  data:
                    (createUserAttempt.error as any).data?.message ||
                    (createUserAttempt.error as any).message ||
                    "Failed to create user in database",
                },
              };
            }
            dbUser = createUserAttempt.data as User | undefined;
          } else if (userDetailsResponse.error) {
            return {
              error: {
                status: (userDetailsResponse.error as any).status || 500,
                data:
                  (userDetailsResponse.error as any).data?.message ||
                  "Could not fetch user data",
              },
            };
          }

          if (!dbUser) {
            return {
              error: {
                status: 500,
                data: "User details could not be retrieved or created.",
              },
            };
          }

          return {
            data: {
              cognitoInfo: { ...cognitoAuthUser },
              userInfo: dbUser,
              userRole: dbUser.role || userRoleFromToken || "USER",
            },
          };
        } catch (error: any) {
          return {
            error: {
              status: 500,
              data:
                error.message ||
                "Could not fetch user data due to a critical client-side error",
            },
          };
        }
      },
      providesTags: (result) =>
        result?.userInfo
          ? [{ type: "User", id: result.userInfo.id }]
          : ["User"],
    }),
  }),
});

export const { useGetAuthUserQuery } = api;
