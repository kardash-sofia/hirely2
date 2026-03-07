import { Box, Container, Typography, Grid, Stack } from '@mui/material';
import featureExplore from '../../assets/features/feature-explore.svg';
import featureSearch from '../../assets/features/feature-search.svg';
import featureDeal from '../../assets/features/feature-deal.svg';
import featureMission from '../../assets/features/feature-mission.svg';

type Feature = {
  icon: string;
  label: string;
};

const features: Feature[] = [
  { icon: featureExplore, label: 'Cadastre-se e explore' },
  { icon: featureSearch, label: 'Pesquise diversas áreas' },
  { icon: featureDeal, label: 'Forme equipes' },
  { icon: featureMission, label: 'Impulsione sua publicação' },
];

export const Features = () => (
  <Box sx={{ py: { xs: 6, md: 10 } }}>
    <Container maxWidth="lg">
      <Stack spacing={6} alignItems="center">
        <Typography
          variant="h1"
          sx={{ color: 'secondary.main', textShadow: '2px 2px 10px rgba(0,0,0,0.2)', textAlign: 'center' }}
        >
          Tornamos sua jornada mais simples
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {features.map((f) => (
            <Grid xs={12} sm={6} md={4} key={f.label} sx={{ textAlign: 'center' }}>
              <Stack spacing={2} alignItems="center">
                <Box component="img" src={f.icon} sx={{ width: 240 }} />
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 700, color: 'secondary.main', textShadow: '1px 2px 5px rgba(0,0,0,0.2)' }}
                >
                  {f.label}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Typography
          variant="h3"
          sx={{ color: 'secondary.main', textShadow: '2px 2px 10px rgba(0,0,0,0.2)', textAlign: 'center' }}
        >
          Nós existimos para facilitar sua divulgação e te ajudamos a achar o ✨brilho✨ do seu projeto.
        </Typography>
      </Stack>
    </Container>
  </Box>
);

