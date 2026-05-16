import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Typography,
} from "@mui/material";

import { BasicList } from "../../common/BasicList";
import { useGetProjects } from "./hooks/useGetProjects";
import { ProjectItem } from "./components/ProjectItem";
import DUMMY_IMAGE from '../../assets/img.jpg';
import { useAuth } from "../../app/context/AuthContext";
import { Role } from "../Auth/types";
import { useGetConstants } from "./hooks/useGetConstants";
import { ProjectFilters } from "./components/ProjectFilters";
import type { FiltersState } from "./types";

export const ProjectsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const itemsPerPage = 6;

  const { data: constants, isLoading: constantsLoading } = useGetConstants();

  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState<FiltersState>({
    status: "",
    categories: [],
    technologies: [],
    sortField: "createdAt",
    sortOrder: "DESC",
  });

  const query = useMemo(() => ({
    limit: itemsPerPage,
    offset: (page - 1) * itemsPerPage,
    status: filters.status || undefined,
    categories: filters.categories.length ? filters.categories : undefined,
    technologies: filters.technologies.length ? filters.technologies : undefined,
    sortField: filters.sortField,
    sortOrder: filters.sortOrder,  
  }), [page, itemsPerPage, filters]);

  const updateFilter = <K extends keyof FiltersState>(key: K, value: FiltersState[K]) => {
    setPage(1);
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const { data, isLoading } = useGetProjects(query);

  const handleCreateProject = () => {
    navigate('/projects/create');
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>
          Projects
        </Typography>
        {user?.role === Role.CUSTOMER && (
          <Button
            onClick={handleCreateProject}
            variant="contained"
            sx={{ borderRadius: '12px', px: 3, py: 1, fontWeight: 600 }}
          >
            Create Project
          </Button>
        )}
      </Box>

      {/* FILTERS + SORTING */}
      <ProjectFilters
        filters={filters}
        updateFilter={updateFilter}
        constants={constants}
        onReset={() => {
          setPage(1);
          setFilters({
            status: "",
            categories: [],
            technologies: [],
            sortField: "createdAt",
            sortOrder: "DESC",
          });
        }}
      />

      {/* PROJECT LIST */}
      <BasicList
        items={data?.items || []}
        total={data?.total || 0}
        renderItem={(item) => <ProjectItem {...item} image={DUMMY_IMAGE} />}
        loading={isLoading || constantsLoading}
        itemsPerPage={itemsPerPage}
        page={page}
        onPageChange={setPage}
      />
    </Container>
  );
};