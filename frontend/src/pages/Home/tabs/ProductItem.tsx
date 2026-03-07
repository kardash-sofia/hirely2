import React from 'react';
import { Card, CardContent, CardMedia, Divider, Typography } from '@mui/material';

export type ProductItemType = {
  id: string;
  image: string;
  title: string;
  budgetMin: string;
  budgetMax: string;
};

export const ProductItem: React.FC<ProductItemType> = ({ image, title, budgetMin, budgetMax }) => {
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: 3,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 6,
        },
      }}
    >
      {image && (
        <CardMedia component="img" height="140" image={image} alt={title} />
      )}
      <CardContent>
        <Typography variant="body2">
          {title}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Typography variant="body2" sx={{ fontWeight: 400, textAlign: 'right' }} color="text.secondary">
          ${budgetMin}-{budgetMax}
        </Typography>
      </CardContent>
    </Card>
  );
};
