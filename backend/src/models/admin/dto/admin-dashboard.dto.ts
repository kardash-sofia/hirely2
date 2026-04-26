export type ChartItemDto = {
  label: string;
  value: number;
};

export type MonthlyChartItemDto = {
  month: string;
  value: number;
};

export type BudgetByCategoryDto = {
  category: string;
  averageBudget: number;
  projectsCount: number;
};

export type AdminDashboardDto = {
  totals: {
    users: number;
    freelancers: number;
    customers: number;
    admins: number;
    projects: number;
    openProjects: number;
    completedProjects: number;
    applications: number;
    messages: number;
  };

  budget: {
    averageBudget: number;
    minBudget: number;
    maxBudget: number;
  };

  usersByRole: ChartItemDto[];
  projectsByStatus: ChartItemDto[];
  applicationsByStatus: ChartItemDto[];
  projectsByCategory: ChartItemDto[];
  mostUsedTechnologies: ChartItemDto[];
  projectsByMonth: MonthlyChartItemDto[];
  applicationsByMonth: MonthlyChartItemDto[];
  averageBudgetByCategory: BudgetByCategoryDto[];
};
