import { Box } from "@mui/material";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  gap?: number;
};

export const HorizontalScroll = ({ children, gap = 2 }: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap,
        overflowX: "auto",
        pb: 1,

        "&::-webkit-scrollbar": {
          height: 6,
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#ccc",
          borderRadius: 3,
        },
      }}
    >
      {children}
    </Box>
  );
};