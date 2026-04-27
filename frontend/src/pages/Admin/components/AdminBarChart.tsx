import { Box } from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ChartItem } from "../types";
import { ChartCard } from "./ChartCard";
import { EmptyChart } from "./EmptyChart";

type Props = {
  title: string;
  subtitle?: string;
  data: ChartItem[];
};

export const AdminBarChart = ({ title, subtitle, data }: Props) => {
  const formattedData = data.map((item) => ({
    ...item,
    label: item.label,
  }));

  return (
    <ChartCard title={title} subtitle={subtitle}>
      {data.length === 0 ? (
        <EmptyChart />
      ) : (
        <Box height={320}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                interval={0}
                angle={-15}
                textAnchor="end"
                height={70}
              />

              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />

              <Tooltip />

              <Bar
                dataKey="value"
                radius={[12, 12, 0, 0]}
                fill="#B275FF"
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
    </ChartCard>
  );
};
