import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { createNewUserInDatabase } from "@/lib/utils";
import { Post, User } from "@/types/prismaTypes";

// Custom async baseQuery to allow async token fetching
const customBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let headers: HeadersInit = {};
  try {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken;
    if (idToken) {
      headers = {
        ...headers,
        Authorization: `Bearer ${idToken.toString()}`,
      };
    }
  } catch (error) {
    console.error("Error fetching auth session for headers:", error);
  }

  // Use fetchBaseQuery with the headers
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers,
  });
  return rawBaseQuery(args, api, extraOptions);
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery,
  tagTypes: ["User", "Post"],
  endpoints: (builder) => ({
    getAuthUser: builder.query<AuthUserResponse, void>({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
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
    requestAuthorRole: builder.mutation<any, void>({
      query: () => ({
        url: "/request-author",
        method: "POST",
      }),
    }),
    updateUserSettings: builder.mutation<
      User,
      { cognitoId: string } & Partial<User>
    >({
      query: ({ cognitoId, ...updateUser }) => ({
        url: `/user/${cognitoId}`,
        method: "PUT",
        body: updateUser,
      }),
      invalidatesTags: (result, error, arg) =>
        result ? [{ type: "User", id: result.id }] : ["User"],
    }),
    getArticles: builder.query<Post[], void>({
      query: () => "/article",
      providesTags: ["Post"],
    }),
  }),
});

export const {
  useGetAuthUserQuery,
  useUpdateUserSettingsMutation,
  useRequestAuthorRoleMutation,
  useGetArticlesQuery,
} = api;
