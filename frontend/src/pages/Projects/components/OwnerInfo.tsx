import { Avatar, Box, Typography } from "@mui/material";

export const OwnerInfo = ({ owner }: { owner: { id: string; fullName: string; avatar?: string, email?: string } }) => {
  return (
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
  )
}