export const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },

  projects: {
    list: "/projects",
    byId: (id: string) => `/projects/byId/${id}`,
    constants: "/projects/constants",
    create: "/projects",
    applications: (projectId: string) => `/projects/${projectId}/applications`,
  },

  profile: {
    userById: (id: string) => `/users/${id}`,
    getMe: () => `/users/profile/me`,
  },

  projectApplications: {
    create: "/project-applications",
    my: "/project-applications/my",
    withdraw: (id: string) => `/project-applications/${id}/withdraw`,
    accept: (id: string) => `/project-applications/${id}/accept`,
    reject: (id: string) => `/project-applications/${id}/reject`,
  },
};