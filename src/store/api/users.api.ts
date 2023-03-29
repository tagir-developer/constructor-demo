import { api } from './api';

export const USERS_API_URL = '/users';

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // getUsers: builder.query<DataWithPagination<IUser>, string>({
    //   query: (params) => {
    //     const url = params ? `${USERS_API_URL}?${params}` : USERS_API_URL;
    //     return { url };
    //   },
    // }),
    // createUser: builder.mutation<{ message: string }, ICreateUserDto>({
    //   query: (data) => ({
    //     url: `${USERS_API_URL}/create`,
    //     method: 'POST',
    //     body: data,
    //   }),
    // }),
    // updateWallets: builder.mutation<{ message: string }, FormData>({
    //   query: (data) => ({
    //     url: `${USERS_API_URL}/update-file`,
    //     method: 'POST',
    //     body: data,
    //   }),
    // }),
    // editStatusWallet: builder.mutation<{ message: string }, FormData>({
    //   query: (data) => ({
    //     url: USERS_API_URL,
    //     method: 'PUT',
    //     body: data,
    //   }),
    // }),
  }),
});
