import { Box, Typography } from "@mui/material";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { MonthlyChartItem } from "../types";
import { ChartCard } from "./ChartCard";

type Props = {
  title: string;
  subtitle?: string;
  data: MonthlyChartItem[];
  lineName: string;
};

export const AdminLineChart = ({ title, subtitle, data, lineName }: Props) => {
  return (
    <ChartCard title={title} subtitle={subtitle}>
      {data.length === 0 ? (
        <EmptyChart />
      ) : (
        <Box height={320}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis dataKey="month" tickLine={false} axisLine={false} />

              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="value"
                name={lineName}
                stroke="#75A5FF"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
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
