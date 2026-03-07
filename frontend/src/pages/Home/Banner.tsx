import { Box, Typography } from '@mui/material';
import BANNER_IMG from '../../assets/banner.jpg';
import LOGO_IMG from '../../assets/logo.svg';

export const Banner = () => {
  return (
    <Box
      sx={{
        height: { xs: 400, md: 650 },
        backgroundImage: `url(${BANNER_IMG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        px: { xs: 2, md: 8 },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          maxWidth: { xs: '100%', md: '60%' },
        }}
      >
        <img src={LOGO_IMG} alt="Hirely Logo" style={{ marginBottom: '16px' }} />
        <Typography
          variant="h2"
          sx={{
            color: '#fff',
            textShadow: '2px 2px 10px rgba(0,0,0,0.5)',
            wordBreak: 'break-word',
            mb: 2,
          }}
        >
          Um espaço abundante em mídias digitais
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ color: '#fff', wordBreak: 'break-word' }}
        >
          Encontre prestadores de serviços digitais ou ofereça seus próprios serviços. Todo projeto começa com uma ideia, nós facilitamos o resto...
        </Typography>
      </Box>
    </Box>
  );
};
