import { Box, Typography, Chip, Stack, Card } from "@mui/material";
import type { ProjectItemType } from "../../../Projects/components/ProjectItem";
import { Link } from "react-router-dom";

export const ProjectsTab = ({ projects }: { projects: ProjectItemType[] }) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        overflowX: "auto",
        pb: 1,
        "&::-webkit-scrollbar": { height: 6 },
        "&::-webkit-scrollbar-thumb": {
          background: "#ccc",
          borderRadius: 3,
        },
      }}
    >
      {projects?.map((item) => (
        <Card
          component={Link}
          to={`/projects/${item.id}`}
          key={item.id}
          sx={{
            textDecoration: "none",
            minWidth: "300px",
            maxWidth: "300px",
            flexShrink: 0,
            p: 2,
            borderRadius: 3,
            cursor: "pointer",
            transition: "0.2s",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: 6,
            },
          }}
        >
          <Box
            sx={{
              height: 140,
              borderRadius: 2,
              background: "#EDE9FF",
              mb: 1.5,
              backgroundImage: item.image ? `url(${item.image})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          <Typography fontWeight={600} sx={{ mb: 0.5 }}>
            {item.title}
          </Typography>

          {item.description && (
            <Typography
              fontSize={13}
              color="text.secondary"
              sx={{
                mb: 1,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {item.description}
            </Typography>
          )}

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography fontSize={13} fontWeight={500}>
              {item.budgetMin && item.budgetMax
                ? `$${item.budgetMin} - $${item.budgetMax}`
                : "No budget"}
            </Typography>

            <Chip
              label={item.status}
              size="small"
              sx={{
                background: "#F3F0FF",
                color: "#46307B",
                fontWeight: 500,
              }}
            />
          </Stack>
        </Card>
      ))}
    </Box>
  );
};