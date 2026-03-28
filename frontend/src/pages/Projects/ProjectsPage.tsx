import { Box, Button, Container, Typography } from "@mui/material"
import { BasicList } from "../../common/BasicList"
import { useGetProjects } from "../../hooks/useProjects";
import { ProjectItem } from "./components/ProjectItem";
import DUMMY_IMAGE from '../../assets/img.jpg';
import { Role, useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const ProjectsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const itemsPerPage = 12;
  
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [page, setPage] = useState(0);

  const { data, isLoading } = useGetProjects({
      limit: itemsPerPage,
      offset: page * itemsPerPage,
      status: statusFilter,
      categories: categoryFilter
    });

  const handleCreateProject = () => {
    navigate('/projects/create');
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight={700}>
          Projects
        </Typography>


        {user?.role === Role.CUSTOMER && (
          <Button
            onClick={handleCreateProject}
            variant="contained"
            sx={{
              borderRadius: '12px',
              px: 3,
              py: 1,
              fontWeight: 600,
            }}
          >
            Create Project
          </Button>
        )}
      </Box>

      <Box mb={3}>
        Filters
      </Box>

      <BasicList
        items={data?.items || []}
        total={data?.total || 0}
        renderItem={(item) => (
          <ProjectItem {...item} image={DUMMY_IMAGE} />
        )}
        loading={isLoading}
        itemsPerPage={itemsPerPage}
      />
    </Container>
  );
}