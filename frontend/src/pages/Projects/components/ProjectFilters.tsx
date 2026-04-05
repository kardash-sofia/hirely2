import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import { ProjectStatus, type FiltersState } from "../types";

type Props = {
  filters: FiltersState;
  updateFilter: <K extends keyof FiltersState>(
    key: K,
    value: FiltersState[K]
  ) => void;
  onReset: () => void;
  constants?: {
    categories: { id: string; name: string }[];
    technologies: { id: string; name: string }[];
  };
};

export const ProjectFilters = ({
  filters,
  updateFilter,
  onReset,
  constants,
}: Props) => {
  const hasActiveFilters =
    filters.status ||
    filters.categories.length ||
    filters.technologies.length ||
    filters.sortField !== "createdAt" ||
    filters.sortOrder !== "DESC";

  return (
    <Box
      sx={{
        p: 3,
        mb: 4,
        borderRadius: "20px",
        background: "background.paper",
        border: "1px solid #eee",
      }}
    >
      {/* HEADER */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography fontWeight={600}>Filters</Typography>

        {hasActiveFilters && (
          <Button
            size="small"
            onClick={onReset}
            sx={{
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Reset all
          </Button>
        )}
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {/* FILTER GRID */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr 1fr",
          },
          gap: 2,
        }}
      >
        {/* STATUS */}
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            onChange={(e) =>
              updateFilter("status", e.target.value as ProjectStatus)
            }
            label="Status"
          >
            <MenuItem value="">All</MenuItem>
            {Object.values(ProjectStatus).map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* CATEGORIES */}
        <FormControl fullWidth>
          <InputLabel>Categories</InputLabel>
          <Select
            multiple
            value={filters.categories}
            onChange={(e) =>
              updateFilter("categories", e.target.value as string[])
            }
            input={<OutlinedInput label="Categories" />}
            renderValue={(selected) => (
              <Stack direction="row" flexWrap="wrap" gap={0.5}>
                {(selected as string[]).map((id) => {
                  const category = constants?.categories.find(
                    (c) => c.id === id
                  );
                  return (
                    <Chip
                      key={id}
                      label={category?.name || id}
                      size="small"
                    />
                  );
                })}
              </Stack>
            )}
          >
            {constants?.categories?.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* TECHNOLOGIES */}
        <FormControl fullWidth>
          <InputLabel>Technologies</InputLabel>
          <Select
            multiple
            value={filters.technologies}
            onChange={(e) =>
              updateFilter("technologies", e.target.value as string[])
            }
            input={<OutlinedInput label="Technologies" />}
            renderValue={(selected) => (
              <Stack direction="row" flexWrap="wrap" gap={0.5}>
                {(selected as string[]).map((id) => {
                  const tech = constants?.technologies.find(
                    (t) => t.id === id
                  );
                  return (
                    <Chip key={id} label={tech?.name || id} size="small" />
                  );
                })}
              </Stack>
            )}
          >
            {constants?.technologies?.map((t) => (
              <MenuItem key={t.id} value={t.id}>
                {t.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* SORT */}
        <FormControl fullWidth>
          <InputLabel>Sort</InputLabel>
          <Select
            value={`${filters.sortField}_${filters.sortOrder}`}
            onChange={(e) => {
                const [field, order] = e.target.value.split("_");
                updateFilter("sortField", field);
                updateFilter("sortOrder", order as "ASC" | "DESC");
            }}
            >
            <MenuItem value="createdAt_DESC">Newest</MenuItem>
            <MenuItem value="createdAt_ASC">Oldest</MenuItem>
            <MenuItem value="budgetMin_ASC">Budget ↑</MenuItem>
            <MenuItem value="budgetMin_DESC">Budget ↓</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* ACTIVE FILTERS (як у нормальних UI) */}
      {hasActiveFilters && (
        <Stack direction="row" flexWrap="wrap" gap={1} mt={3}>
          {filters.status && (
            <Chip
              label={`Status: ${filters.status}`}
              onDelete={() => updateFilter("status", "")}
            />
          )}

          {filters.categories.map((id) => {
            const category = constants?.categories.find(c => c.id === id);
            return (
              <Chip
                key={id}
                label={category?.name || id}
                onDelete={() =>
                  updateFilter(
                    "categories",
                    filters.categories.filter(c => c !== id)
                  )
                }
              />
            );
          })}

          {filters.technologies.map((id) => {
            const tech = constants?.technologies.find(t => t.id === id);
            return (
              <Chip
                key={id}
                label={tech?.name || id}
                onDelete={() =>
                  updateFilter(
                    "technologies",
                    filters.technologies.filter(t => t !== id)
                  )
                }
              />
            );
          })}
        </Stack>
      )}
    </Box>
  );
};