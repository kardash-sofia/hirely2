import { Box, Container, Typography, Chip, Stack, Avatar, Divider, Paper } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonIcon from '@mui/icons-material/Person';
import { useParams } from 'react-router-dom';
import { useGetProjectDetails } from '../hooks/useGetProjectDetails';
import { Loader } from '../../../common/Loader';

const DUMMY_IMAGE = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2070';

export const ProjectDetailsPage = () => {

  const { id } = useParams<{ id: string }>();

  console.log("ID перед хуком:", id, typeof id);

  const { data, isLoading } = useGetProjectDetails(id ?? '');

  return (
    <Box>
      {/* HEADER / COVER */}
      <Loader loading={isLoading} />
      <Box
        sx={{
          height: 260,
          backgroundImage: `url(${DUMMY_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.3), rgba(0,0,0,0.7))',
          }}
        />

        <Container
          sx={{
            position: 'relative',
            zIndex: 1,
            height: '100%',
            display: 'flex',
            alignItems: 'flex-end',
            pb: 3,
          }}
        >
          <Box>
            <Typography variant="h4" color="white" fontWeight={700}>
              {data?.title}
            </Typography>
            <Chip
              label={data?.status}
              sx={{ mt: 1, bgcolor: 'primary.main', color: '#fff' }}
            />
          </Box>
        </Container>
      </Box>

      {/* CONTENT */}
      <Container sx={{ mt: 4 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>

          {/* LEFT SIDE */}
          <Box flex={3}>
            <Paper sx={{ p: 3, borderRadius: 3 }} elevation={2}>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography color="text.secondary">
                {data?.description || 'No description provided.'}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Technologies
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {data?.projectTechnologies?.map((t, i) => (
                  <Chip key={i} label={t.name} variant="outlined" />
                ))}
              </Stack>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Categories
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {data?.projectCategories?.map((c, i) => (
                  <Chip key={i} label={c.name} />
                ))}
              </Stack>
            </Paper>
          </Box>

          {/* RIGHT SIDE */}
          <Box flex={1}>
            <Stack spacing={3}>

              {/* BUDGET */}
              <Paper sx={{ p: 2, borderRadius: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <AttachMoneyIcon />
                  <Typography fontWeight={600}>Budget</Typography>
                </Stack>
                <Typography color="text.secondary" mt={1}>
                  {data?.budgetMin && data?.budgetMax
                    ? `$${data.budgetMin} - $${data.budgetMax}`
                    : 'Not specified'}
                </Typography>
              </Paper>

              {/* DEADLINE */}
              <Paper sx={{ p: 2, borderRadius: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CalendarTodayIcon />
                  <Typography fontWeight={600}>Deadline</Typography>
                </Stack>
                <Typography color="text.secondary" mt={1}>
                  {data?.dueDate || 'No deadline'}
                </Typography>
              </Paper>

              {/* OWNER */}
              <Paper sx={{ p: 2, borderRadius: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PersonIcon />
                  <Typography fontWeight={600}>Owner</Typography>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center" mt={1}>
                  <Avatar src={data?.owner?.fullName} />
                  <Typography>{data?.owner?.email || 'Unknown'}</Typography>
                </Stack>
              </Paper>

              {/* EXECUTOR */}
              {data?.executor && (
                <Paper sx={{ p: 2, borderRadius: 3 }}>
                  <Typography fontWeight={600}>Executor</Typography>
                  <Stack direction="row" spacing={2} alignItems="center" mt={1}>
                    <Avatar src={data.executor.fullName} />
                    <Typography>{data.executor.email}</Typography>
                  </Stack>
                </Paper>
              )}

            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};
