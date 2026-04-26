import { Box, Typography } from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { BudgetByCategory } from "../types";
import { ChartCard } from "./ChartCard";

type Props = {
  data: BudgetByCategory[];
};

export const BudgetByCategoryChart = ({ data }: Props) => {
  return (
    <ChartCard
      title="Average budget by category"
      subtitle="Shows which project categories usually have higher budgets."
    >
      {data.length === 0 ? (
        <EmptyChart />
      ) : (
        <Box height={340}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis
                dataKey="category"
                tickLine={false}
                axisLine={false}
                interval={0}
                angle={-15}
                textAnchor="end"
                height={70}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />

              <Tooltip
                //formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `Category: ${label}`}
              />

              <Bar
                dataKey="averageBudget"
                name="Average budget"
                radius={[12, 12, 0, 0]}
                fill="#75A5FF"
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
    </ChartCard>
  );
};

const EmptyChart = () => (
  <Typography color="text.secondary" py={8} textAlign="center">
    No data yet
  </Typography>
);
