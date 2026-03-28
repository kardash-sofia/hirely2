import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Divider,
  Typography,
  Box,
  Avatar,
} from '@mui/material';

export type ProjectItemType = {
  id: string;
  image: string;
  title: string;
  description?: string;
  budgetMin?: number;
  budgetMax?: number;
  status: string;
  owner: {
    fullName: string;
    email: string;
    avatar?: string;
  };
};

export const ProjectItem: React.FC<ProjectItemType> = ({
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
      sx={{
        borderRadius: 4,
        boxShadow: 3,
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: 6,
        },
      }}
    >
      {/* Image */}
      {image && (
        <CardMedia component="img" height="160" image={image} alt={title} />
      )}

      <CardContent>
        {/* Owner */}
        <Box display="flex" alignItems="center" mb={1.5}>
          <Avatar
            src={owner.avatar}
            sx={{ width: 36, height: 36, mr: 1.5 }}
          >
            {owner.fullName?.[0]}
          </Avatar>

          <Box>
            <Typography variant="body2" fontWeight={600}>
              {owner.fullName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {owner.email}
            </Typography>
          </Box>
        </Box>

        {/* Title */}
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
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