import { Card, CardContent, Typography, Box } from "@mui/material";
import type { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: number | string;
  icon: ReactNode;
  subtitle?: string;
};

export const StatCard = ({ title, value, icon, subtitle }: StatCardProps) => {
  return (
    <Card
      sx={{
        height: "150px",
        borderRadius: 4,
        background:
          "linear-gradient(135deg, rgba(178,117,255,0.12), rgba(117,165,255,0.08))",
        border: "1px solid rgba(178,117,255,0.14)",
        boxShadow: "0 18px 45px rgba(17, 24, 39, 0.08)",
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>

            <Typography variant="h4" fontWeight={800} mt={0.5}>
              {value}
            </Typography>

            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "16px",
              display: "grid",
              placeItems: "center",
              color: "primary.main",
              bgcolor: "rgba(178,117,255,0.14)",
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
