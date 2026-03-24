import { Avatar, Typography, Box } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

type Props = {
  fullName: string;
  email: string;
};

export const SidebarHeader: React.FC<Props> = ({ fullName, email }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      p: 2,
      mb: 2,
      borderBottom: '1px solid #eee',
      backgroundColor: '#f9f9f9',
      borderRadius: 2,
    }}
  >
    <Avatar
      sx={{
        bgcolor: 'transparent',
        backgroundImage: 'linear-gradient(135deg, #6C63FF, #B275FF)',
        color: '#fff',
        mr: 2,
        width: 50,
        height: 50,
        fontSize: 24,
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      }}
    >
      <PersonIcon fontSize="large" />
    </Avatar>
    <Box sx={{ overflow: 'hidden' }}>
      <Typography
        variant="body1"
        fontWeight={700}
        noWrap
        sx={{ textOverflow: 'ellipsis' }}
      >
        {fullName}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        noWrap
        sx={{ textOverflow: 'ellipsis' }}
      >
        {email}
      </Typography>
    </Box>
  </Box>
);