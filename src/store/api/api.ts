import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { TypeUnknown } from 'common/interfaces';
import { TypeRootState } from 'store/store';

export const API_URL = `${process.env.REACT_APP_API_URL}/admin-api`;

export const api = createApi({
  reducerPath: 'api',
  // tagTypes: ['Profile'],
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    // prepareHeaders: (headers, { getState }) => {
    //   const token = (getState() as TypeRootState).common.token;

    //   if (token) {
    //     headers.set('Authorization', `Bearer ${token}`);
    //   }

    //   return headers;
    // },
  }),
  endpoints: (builder) => ({
    getProfile: builder.query<TypeUnknown, TypeUnknown>({
      query: () => '/profile',
      // providesTags: ['Profile'],
    }),
  }),
});

export const { useGetProfileQuery } = api;
