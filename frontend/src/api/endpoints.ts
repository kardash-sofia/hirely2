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
    predictProfit: "/projects/predict_profit",
    predictShip: "/projects/predict_ship",
    constants: "/projects/constants",
    create: "/projects"
  },
};