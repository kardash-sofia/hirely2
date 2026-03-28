import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Typography } from "@mui/material"

import { BasicList } from "../../common/BasicList"
import { useGetProjects } from "./hooks/useGetProjects";
import { ProjectItem } from "./components/ProjectItem";
import DUMMY_IMAGE from '../../assets/img.jpg';
import { useAuth } from "../Auth/useAuth";
import { Role } from "../Auth/types";

export const ProjectsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const itemsPerPage = 12;
  
  const [page] = useState(0);

  const { data, isLoading } = useGetProjects({
      limit: itemsPerPage,
      offset: page * itemsPerPage,
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