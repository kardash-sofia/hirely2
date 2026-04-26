export type ChartItem = {
  label: string;
  value: number;
};

export type MonthlyChartItem = {
  month: string;
  value: number;
};

export type BudgetByCategory = {
  category: string;
  averageBudget: number;
  projectsCount: number;
};

export type AdminDashboard = {
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

  usersByRole: ChartItem[];
  projectsByStatus: ChartItem[];
  applicationsByStatus: ChartItem[];
  projectsByCategory: ChartItem[];
  mostUsedTechnologies: ChartItem[];
  projectsByMonth: MonthlyChartItem[];
  applicationsByMonth: MonthlyChartItem[];
  averageBudgetByCategory: BudgetByCategory[];
};
