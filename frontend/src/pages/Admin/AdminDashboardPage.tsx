import { useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Grid,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";

import { useAdminDashboard } from "./hooks/useAdminDashboard";
import { StatCard } from "./components/StatCard";
import { AdminPieChart } from "./components/AdminPieChart";
import { AdminBarChart } from "./components/AdminBarChart";
import { AdminLineChart } from "./components/AdminLineChart";
import { BudgetByCategoryChart } from "./components/BudgetByCategoryChart";
import { formatCurrency } from "./utils";

type DashboardTab = "overview" | "applications" | "market";

export const AdminDashboardPage = () => {
  const { data, isLoading, isError } = useAdminDashboard();
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (isError || !data) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Alert severity="error">
          Failed to load admin analytics. Please try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          mb: 3,
          p: { xs: 2.5, md: 4 },
          borderRadius: 5,
          color: "white",
          background: "linear-gradient(135deg, #1A0B40 0%, #6C63FF 100%)",
          boxShadow: "0 22px 60px rgba(108, 99, 255, 0.28)",
        }}
      >
        <Typography variant="h4" fontWeight={900}>
          Admin Dashboard
        </Typography>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(_, value: DashboardTab) => setActiveTab(value)}
        sx={{
          mb: 3,
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 700,
          },
        }}
      >
        <Tab value="overview" label="Overview" />
        <Tab value="applications" label="Applications" />
        <Tab value="market" label="Market" />
      </Tabs>

      {activeTab === "overview" && (
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Total users"
              value={data.totals.users}
              subtitle={`${data.totals.freelancers} freelancers · ${data.totals.customers} customers`}
              icon={<PeopleAltOutlinedIcon />}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Projects"
              value={data.totals.projects}
              subtitle={`${data.totals.openProjects} open · ${data.totals.completedProjects} completed`}
              icon={<WorkOutlineOutlinedIcon />}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Applications"
              value={data.totals.applications}
              subtitle="Freelancer project requests"
              icon={<AssignmentTurnedInOutlinedIcon />}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Messages"
              value={data.totals.messages}
              subtitle="Real-time communication"
              icon={<ChatBubbleOutlineOutlinedIcon />}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Average budget"
              value={formatCurrency(data.budget.averageBudget)}
              subtitle={`Min ${formatCurrency(data.budget.minBudget)} · Max ${formatCurrency(data.budget.maxBudget)}`}
              icon={<PaidOutlinedIcon />}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Admins"
              value={data.totals.admins}
              subtitle="Users with admin access"
              icon={<AdminPanelSettingsOutlinedIcon />}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <AdminPieChart
              title="Users by role"
              subtitle="Distribution of platform users by role."
              data={data.usersByRole}
            />
          </Grid>
        </Grid>
      )}

      {activeTab === "applications" && (
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 6 }}>
            <AdminPieChart
              title="Applications by status"
              subtitle="Pending, accepted, rejected or withdrawn applications."
              data={data.applicationsByStatus}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <AdminLineChart
              title="Applications created by month"
              subtitle="Shows freelancer activity and project demand over time."
              data={data.applicationsByMonth}
              lineName="Applications"
            />
          </Grid>
        </Grid>
      )}

      {activeTab === "market" && (
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 6 }}>
            <AdminBarChart
              title="Most used technologies"
              subtitle="Technologies most often requested in projects."
              data={data.mostUsedTechnologies}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <AdminBarChart
              title="Popular project categories"
              subtitle="Categories with the highest number of projects."
              data={data.projectsByCategory}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <BudgetByCategoryChart data={data.averageBudgetByCategory} />
          </Grid>
        </Grid>
      )}
    </Container>
  );
};
