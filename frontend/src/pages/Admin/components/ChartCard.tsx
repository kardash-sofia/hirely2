import { Card, CardContent, Typography } from "@mui/material";
import type { ReactNode } from "react";

type ChartCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export const ChartCard = ({ title, subtitle, children }: ChartCardProps) => {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 4,
        boxShadow: "0 18px 45px rgba(17, 24, 39, 0.08)",
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight={800}>
          {title}
        </Typography>

        {subtitle && (
          <Typography variant="body2" color="text.secondary" mt={0.5} mb={2}>
            {subtitle}
          </Typography>
        )}

        {children}
      </CardContent>
    </Card>
  );
};
