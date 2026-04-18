import { Box, Container, Typography, Chip, Stack, Avatar, Divider, Paper, Button } from '@mui/material';
import { Link as RouterLink } from "react-router-dom";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useParams } from 'react-router-dom';
import { useGetProjectDetails } from '../hooks/useGetProjectDetails';
import { Loader } from '../../../common/Loader';
import { OwnerInfo } from '../components/OwnerInfo';
import { useAuth } from '../../Auth/useAuth';
import { Role } from '../../Auth/types';
import { useGetProjectApplications } from '../hooks/useGetProjectApplications';
import { ProjectStatus } from '../types';
import { HorizontalScroll } from '../../../common/HorizontalScroll/HorizontalScroll';
import { ApplicationCard } from '../../Profile/components/items/ApplicationCard';
import { useState } from 'react';
import { ApplyToProjectModal } from '../components/ApplyToProjectModal';

const DUMMY_IMAGE = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2070';

export const ProjectDetailsPage = () => {

  const { id } = useParams<{ id: string }>();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const { data, isLoading } = useGetProjectDetails(id ?? '');

  const { user } = useAuth();

  const isOwner = user?.id === data?.owner?.id;
  const isFreelancer = user?.role === Role.FREELANCER;

  const { data: applications = [] } = useGetProjectApplications(
    id ?? "",
    !!id && isOwner,
  );

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
          {isFreelancer && !isOwner && data?.status === ProjectStatus.OPEN && (
            <Box sx={{ ml: "auto", alignSelf: "flex-end" }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => setIsApplyModalOpen(true)}
                sx={{
                  borderRadius: 999,
                  px: 3,
                  py: 1.2,
                  fontWeight: 600,
                }}
              >
                Apply to Project
              </Button>
            </Box>
          )}
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
              {data?.owner ? (
              <Box
                component={RouterLink}
                to={`/profile/${data.owner.id}`}
                sx={{
                  textDecoration: "none",
                  color: "inherit",
                  cursor: "pointer",
                }}
              >
                <Paper sx={{ p: 2, borderRadius: 3, "&:hover": { boxShadow: 4 } }}>
                  <OwnerInfo owner={data.owner} />
                </Paper>
              </Box>
            ) : (
              <Typography>No owner information</Typography>
            )}

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

        {/* APPLICATIONS */}
        {isOwner && (
          <HorizontalScroll>
            {applications.length ? (
              applications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  mode="owner"
                />
              ))
            ) : (
              <Typography color="text.secondary">
                No applications yet.
              </Typography>
            )}
          </HorizontalScroll>
        )}
      </Container>
      {data?.id && (
        <ApplyToProjectModal
          open={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          projectId={data.id}
          projectTitle={data.title}
        />
      )}
    </Box>
  );
};
