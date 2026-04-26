import { Box, Typography } from "@mui/material";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

import type { ChartItem } from "../types";
import { ChartCard } from "./ChartCard";
import { formatLabel } from "../utils";

type Props = {
  title: string;
  subtitle?: string;
  data: ChartItem[];
};

const COLORS = ["#B275FF", "#75A5FF", "#7DD3FC", "#C084FC", "#A7F3D0", "#FDE68A"];

export const AdminPieChart = ({ title, subtitle, data }: Props) => {
  return (
    <ChartCard title={title} subtitle={subtitle}>
      {data.length === 0 ? (
        <EmptyChart />
      ) : (
        <Box height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                outerRadius={95}
                innerRadius={55}
                paddingAngle={3}
                //label={({ label, value }) => `${formatLabel(label)}: ${value}`}
                label={({ label, value }) => `${label}: ${value}`}
              >
                {data.map((item, index) => (
                  <Cell
                    key={item.label}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip/>

              {/* <Legend formatter={(value) => formatLabel(String(value))} /> */}
              <Legend formatter={(value) => (String(value))} />
            </PieChart>
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
