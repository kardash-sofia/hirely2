import { Chip, Paper, Typography, Stack } from "@mui/material";

export const SkillsTab = () => {
  const skills = ["React", "NestJS", "Node.js", "TypeScript"];

  return (
    <Paper sx={{ p: 2, borderRadius: 3 }}>
      <Typography fontWeight={600} sx={{ mb: 2 }}>
        Skills
      </Typography>

      <Stack direction="row" spacing={1} flexWrap="wrap">
        {skills.map((skill) => (
          <Chip
            key={skill}
            label={skill}
            sx={{
              background: "#F3F0FF",
              color: "#46307B",
              fontWeight: 500,
            }}
          />
        ))}
      </Stack>
    </Paper>
  );
};