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
    myApplication: (projectId: string) => `/projects/${projectId}/my-application`,
    submitForReview: (projectId: string) =>
      `/projects/${projectId}/submit-for-review`,
    requestRework: (projectId: string) =>
      `/projects/${projectId}/request-rework`,
    complete: (projectId: string) => `/projects/${projectId}/complete`,
    cancel: (projectId: string) => `/projects/${projectId}/cancel`,
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

  ai: {
    predictBudget: "/ai/predict-budget",
    predictCategory: "/ai/predict-category",
    generateDescription: "/ai/generate-description",
  },

  recommendations: {
    freelancersForProject: (projectId: string) =>
      `/recommendations/projects/${projectId}/freelancers`,
  },

  admin: {
    dashboard: "/admin/dashboard",
  },
};