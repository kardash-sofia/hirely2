import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Divider,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { OwnerInfo } from "./OwnerInfo";

export type ProjectItemType = {
  id: string;
  image: string;
  title: string;
  description?: string;
  budgetMin?: number;
  budgetMax?: number;
  status: string;
  owner: {
    id: string;
    fullName: string;
    email: string;
    avatar?: string;
  };
};

export const ProjectItem: React.FC<ProjectItemType> = ({
  id,
  image,
  title,
  description,
  budgetMin,
  budgetMax,
  status,
  owner,
}) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/projects/${id}`)}
      sx={{
        height: "100%",
        cursor: "pointer",
        borderRadius: 4,
        overflow: "hidden",
        transition: "0.25s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      {image && (
        <CardMedia
          component="img"
          height="170"
          image={image}
          alt={title}
        />
      )}

      <CardContent>
        <OwnerInfo owner={owner} />

        <Typography variant="h6" fontWeight={700} mt={2}>
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          mt={1}
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description || "No description provided."}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography fontWeight={700}>
            {budgetMin && budgetMax ? `$${budgetMin} – $${budgetMax}` : "No budget"}
          </Typography>

          <Chip label={status} size="small" color="primary" />
        </Box>
      </CardContent>
    </Card>
  );
};