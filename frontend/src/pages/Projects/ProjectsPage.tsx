import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
} from "@mui/material";

import { BasicList } from "../../common/BasicList";
import { useGetProjects } from "./hooks/useGetProjects";
import { ProjectItem } from "./components/ProjectItem";
import DUMMY_IMAGE from '../../assets/img.jpg';
import { useAuth } from "../Auth/useAuth";
import { Role } from "../Auth/types";
import { useGetConstants } from "./hooks/useGetConstants";
import { ProjectStatus } from "./types";

export const ProjectsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const itemsPerPage = 6;

  const { data: constants, isLoading: constantsLoading } = useGetConstants();

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "">("");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [technologyFilter, setTechnologyFilter] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("createdAt_DESC");

  const query = useMemo(() => ({
    limit: itemsPerPage,
    offset: (page - 1) * itemsPerPage,
    status: statusFilter || undefined,
    categories: categoryFilter.length ? categoryFilter : undefined,
    technologies: technologyFilter.length ? technologyFilter : undefined,
    sort: sortOption,
  }), [itemsPerPage, page, statusFilter, categoryFilter, technologyFilter, sortOption]);

  const { data, isLoading } = useGetProjects(query);

  const handleCreateProject = () => {
    navigate('/projects/create');
  }

  const formControlStyle = { width: 200, minWidth: 200 }; // фіксована ширина для всіх

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
      <Stack direction="row" spacing={2} mb={3} flexWrap="wrap" alignItems="center">
        {/* STATUS */}
        <FormControl sx={formControlStyle}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as ProjectStatus)}
            label="Status"
          >
            <MenuItem value="">All</MenuItem>
            {Object.values(ProjectStatus).map(s => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* CATEGORIES */}
        <FormControl sx={formControlStyle}>
          <InputLabel>Categories</InputLabel>
          <Select
            multiple
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value as string[])}
            input={<OutlinedInput label="Categories" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, maxHeight: 60, overflowY: "auto" }}>
                {(selected as string[])?.map(id => {
                  const category = constants?.categories.find(c => c.id === id);
                  return <Chip key={id} label={category?.name || id} size="small" />;
                })}
              </Box>
            )}
          >
            {constants?.categories?.map(c => (
              <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* TECHNOLOGIES */}
        <FormControl sx={formControlStyle}>
          <InputLabel>Technologies</InputLabel>
          <Select
            multiple
            value={technologyFilter}
            onChange={e => setTechnologyFilter(e.target.value as string[])}
            input={<OutlinedInput label="Technologies" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, maxHeight: 60, overflowY: "auto" }}>
                {(selected as string[])?.map(id => {
                  const tech = constants?.technologies.find(t => t.id === id);
                  return <Chip key={id} label={tech?.name || id} size="small" />;
                })}
              </Box>
            )}
          >
            {constants?.technologies?.map(t => (
              <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* SORTING */}
        <FormControl sx={formControlStyle}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortOption}
            onChange={e => setSortOption(e.target.value)}
            label="Sort by"
          >
            <MenuItem value="createdAt_DESC">Newest</MenuItem>
            <MenuItem value="createdAt_ASC">Oldest</MenuItem>
            <MenuItem value="budgetMin_ASC">Budget ↑</MenuItem>
            <MenuItem value="budgetMin_DESC">Budget ↓</MenuItem>
          </Select>
        </FormControl>
      </Stack>

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