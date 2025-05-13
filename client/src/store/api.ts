import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers, { getState }) => {
      return headers;
    },
  }),
  tagTypes: ["HeroContent", "MissionContent", "FeatureContent", "CtaContent"],
  endpoints: (builder) => ({
    getHeroContent: builder.query<HeroContent, void>({
      query: () => "content/hero",
      providesTags: (result) =>
        result ? [{ type: "HeroContent", id: result.id }] : [],
    }),
    getMissionContent: builder.query<MissionContent, void>({
      query: () => "content/mission",
      providesTags: (result) =>
        result ? [{ type: "MissionContent", id: result.id }] : [],
    }),
    getFeatureContent: builder.query<FeatureContent[], void>({
      query: () => "content/features",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "FeatureContent" as const,
                id,
              })),
              { type: "FeatureContent", id: "LIST" },
            ]
          : [{ type: "FeatureContent", id: "LIST" }],
    }),
    getCtaContent: builder.query<CtaContent, void>({
      query: () => "content/cta",
      providesTags: (result) =>
        result ? [{ type: "CtaContent", id: result.id }] : [],
    }),
  }),
});

export const {
  useGetHeroContentQuery,
  useGetMissionContentQuery,
  useGetFeatureContentQuery,
  useGetCtaContentQuery,
} = api;
