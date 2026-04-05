import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Divider,
  Typography,
  Box,
} from '@mui/material';
import { OwnerInfo } from './OwnerInfo';

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
  return (
    <Card
      component={Link}
      to={`/projects/${id}`}
      sx={{
        borderRadius: 4,
        boxShadow: 3,
        transition: 'all 0.2s ease',
        textDecoration: 'none',
        '&:hover': {
          cursor: 'pointer',
        }
      }}
    >
      {/* Image */}
      {image && (
        <CardMedia component="img" height="160" image={image} alt={title} />
      )}

      <CardContent>
        {/* Owner */}
        <OwnerInfo owner={owner} />

        {/* Title */}
        <Typography
          variant="subtitle1"
          gutterBottom
          fontWeight={600}
        >
          {title}
        </Typography>

        {/* Description (trimmed) */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            mb: 1,
          }}
        >
          {description}
        </Typography>

        <Divider sx={{ my: 1.5 }} />

        {/* Bottom */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography fontWeight={600}>
            ${budgetMin} – ${budgetMax}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: '10px',
              bgcolor: 'grey.200',
              fontWeight: 500,
            }}
          >
            {status}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};