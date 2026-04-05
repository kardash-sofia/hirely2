export const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },

  projects: {
    list: "/projects",
    byId: (id: string) => `/projects/byId/${id}`,
    constants: "/projects/constants",
    create: "/projects"
  },
};