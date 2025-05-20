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

// Định nghĩa interfaces cho các response
export interface AuthUserResponse {
  cognitoInfo: any;
  userInfo: User;
  userRole: string;
}

export interface RoleRequestResponse {
  id: string;
  userId: string;
  roleRequested: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Custom async baseQuery để xử lý token auth
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
    console.error("Lỗi khi lấy phiên xác thực cho headers:", error);
  }

  // Sử dụng fetchBaseQuery với headers
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers,
  });
  return rawBaseQuery(args, api, extraOptions);
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery,
  tagTypes: ["User", "Post", "RoleRequest"],
  endpoints: (builder) => ({
    // === USER ENDPOINTS ===
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
                data: "Người dùng chưa xác thực hoặc phiên đã hết hạn",
              },
            };
          }

          const cognitoId = cognitoAuthUser.userId;
          const userRoleFromToken = idToken.payload?.["custom:role"] as
            | string
            | undefined;

          let userDetailsResponse = await fetchWithBQ(`/users/${cognitoId}`);
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
                    "Không thể tạo người dùng trong cơ sở dữ liệu",
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
                  "Không thể lấy dữ liệu người dùng",
              },
            };
          }

          if (!dbUser) {
            return {
              error: {
                status: 500,
                data: "Không thể lấy hoặc tạo thông tin người dùng.",
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
                "Không thể lấy dữ liệu người dùng do lỗi phía client",
            },
          };
        }
      },
      providesTags: (result) =>
        result?.userInfo
          ? [{ type: "User", id: result.userInfo.id }]
          : ["User"],
    }),

    updateUserSettings: builder.mutation<
      User,
      { cognitoId: string } & Partial<User>
    >({
      query: ({ cognitoId, ...updateUser }) => ({
        url: `/users/${cognitoId}`,
        method: "PUT",
        body: updateUser,
      }),
      invalidatesTags: (result, error, arg) =>
        result ? [{ type: "User", id: result.id }] : ["User"],
    }),

    // === ROLE REQUEST ENDPOINTS ===
    requestAuthorRole: builder.mutation<
      RoleRequestResponse,
      { message: string }
    >({
      query: (data) => ({
        url: "/request-author",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User", "RoleRequest"],
    }),

    getMyRoleRequests: builder.query<RoleRequestResponse[], void>({
      query: () => "/my-role-requests",
      providesTags: ["RoleRequest"],
    }),

    cancelRoleRequest: builder.mutation<void, string>({
      query: (requestId) => ({
        url: `/role-requests/${requestId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RoleRequest"],
    }),

    // === ARTICLE ENDPOINTS ===
    getArticles: builder.query<Post[], void>({
      query: () => "/articles",
      transformResponse: (response: { data: Post[] }) => response.data,
      providesTags: ["Post"],
    }),

    getArticleById: builder.query<Post, string>({
      query: (id) => `/articles/${id}`,
      providesTags: (result, error, id) =>
        result ? [{ type: "Post", id: result.id }] : ["Post"],
    }),

    createArticle: builder.mutation<
      Post,
      {
        title: string;
        content: string;
        excerpt?: string;
        coverImageUrl?: string;
        authorId: string;
        published?: boolean;
        categoryIds?: string[];
        tagIds?: string[];
        slug?: string;
      }
    >({
      query: (articleData) => ({
        url: "/articles",
        method: "POST",
        body: articleData,
      }),
      invalidatesTags: ["Post"],
    }),

    updateArticle: builder.mutation<
      Post,
      {
        id: string;
        data: {
          title?: string;
          content?: string;
          excerpt?: string;
          coverImageUrl?: string;
          published?: boolean;
          categoryIds?: string[];
          tagIds?: string[];
          slug?: string;
        };
      }
    >({
      query: ({ id, data }) => ({
        url: `/articles/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) =>
        result ? [{ type: "Post", id: result.id }, "Post"] : ["Post"],
    }),

    deleteArticle: builder.mutation<void, string>({
      query: (id) => ({
        url: `/articles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
    }),
  }),
});

export const {
  // User hooks
  useGetAuthUserQuery,
  useUpdateUserSettingsMutation,

  // Role request hooks
  useRequestAuthorRoleMutation,
  useGetMyRoleRequestsQuery,
  useCancelRoleRequestMutation,

  // Article hooks
  useGetArticlesQuery,
  useGetArticleByIdQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} = api;
