export const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },

  users: {
    me: "/users/me",
    list: "/users",
  },

  projects: {
    list: "/projects",
    byId: (id: string) => `/projects/${id}`,
  },
};