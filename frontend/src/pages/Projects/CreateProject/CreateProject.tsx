import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
  OutlinedInput,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
} from "@mui/material";
import { Loader } from "../../../common/Loader";
import { useSnackbar } from "../../../common/Snackbar/useSnackbar";
import { SnackbarType } from "../../../common/Snackbar/types";
import { useCreateProject } from "../hooks/useCreateProject";
import type { CreateTaskType } from "../../../api/services/Projects/types";
import { TaskPriorities } from "../types";
import { useGetConstants } from "../hooks/useGetConstants";

export const CreateProject = () => {
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { data: constants, isLoading: constantsLoading } = useGetConstants();
  const { mutate: createProject } = useCreateProject();

  const [form, setForm] = useState({
    title: "",
    description: "",
    categories: [] as string[],
    technologies: [] as string[],
    dueDate: "",
    budget: "",
    image: null as File | null,
  });

  const [tasks, setTasks] = useState<CreateTaskType[]>([]);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    priority: 2,
    dueDate: "",
  });

  const handleChange = (field: string, value: unknown) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTask = () => {
    setTasks(prev => [...prev, taskForm]);
    setTaskForm({ title: "", description: "", priority: 2, dueDate: "" });
    setOpenTaskModal(false);
  };

  const handleCreateProject = () => {
    const payload = {
      ...form,
      budgetMin: Number(form.budget),
      budgetMax: Number(form.budget) + 200,
      categoryIds: form.categories,
      technologyIds: form.technologies,
      tasks,
    };
    createProject(payload, {
      onSuccess: () => {
        showSnackbar("Project created successfully!", SnackbarType.SUCCESS);
        navigate('/projects');
      },
      onError: (error: Error) => {
        showSnackbar(`Failed to create project. Please try again. ${error.message} `, SnackbarType.ERROR);
      }
    });
  }

  return (
    <Box sx={{ bgcolor: "#F7F8FA", minHeight: "100vh", py: 6 }}>
      <Loader loading={constantsLoading ?? false} />
      
      <Box maxWidth="1000px" mx="auto" px={2}>
        
        {/* Header */}
        <Box mb={4}>
          <Typography variant="h5" fontWeight={600}>
            Create Project
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fill project details below
          </Typography>
        </Box>

        <Grid container spacing={3}>
          
          {/* LEFT COLUMN */}
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <TextField
                label="Project title"
                fullWidth
                value={form.title}
                onChange={e => handleChange("title", e.target.value)}
              />

              <TextField
                label="Description"
                multiline
                rows={5}
                fullWidth
                value={form.description}
                onChange={e => handleChange("description", e.target.value)}
              />

              <FormControl fullWidth>
                <InputLabel>Categories</InputLabel>
                <Select
                  multiple
                  fullWidth
                  value={form.categories}
                  onChange={e => handleChange("categories", e.target.value)}
                  input={<OutlinedInput label="Categories" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                      {(selected as string[]).map(id => {
                        const category = constants?.categories.find(c => c.id === id);
                        return (
                          <Chip
                            key={id}
                            label={category?.name || id}
                            size="small"
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {constants?.categories.map(c => (
                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Technologies</InputLabel>
                <Select
                  multiple
                  fullWidth
                  value={form.technologies}
                  onChange={e => handleChange("technologies", e.target.value)}
                  input={<OutlinedInput label="Technologies" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                      {(selected as string[]).map(id => {
                        const tech = constants?.technologies.find(t => t.id === id);
                        return (
                          <Chip
                            key={id}
                            label={tech?.name || id}
                            size="small"
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {constants?.technologies.map(t => (
                    <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Grid>

          {/* RIGHT COLUMN */}
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    type="date"
                    label="Deadline"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    value={form.dueDate}
                    onChange={e => handleChange("dueDate", e.target.value)}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="Budget ($)"
                    type="number"
                    fullWidth
                    value={form.budget}
                    onChange={e => handleChange("budget", e.target.value)}
                  />
                </Grid>
              </Grid>

              {/* IMAGE */}
              <Box>
                <Typography variant="body2" mb={1} fontWeight={500}>
                  Project Image
                </Typography>

                <Button variant="outlined" component="label" fullWidth>
                  Upload Image
                  <input
                    hidden
                    type="file"
                    onChange={e => handleChange("image", e.target.files?.[0])}
                  />
                </Button>

                {form.image && (
                  <Typography variant="caption" mt={1} display="block">
                    {form.image.name}
                  </Typography>
                )}
              </Box>

              {/* TASKS */}
              <Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" fontWeight={500}>
                    Tasks
                  </Typography>
                  <Button size="small" onClick={() => setOpenTaskModal(true)}>
                    + Add
                  </Button>
                </Box>

                <Divider sx={{ mb: 1 }} />

                <Stack spacing={1}>
                  {tasks.map((task, i) => (
                    <Box
                      key={i}
                      sx={{
                        p: 1.2,
                        borderRadius: 2,
                        bgcolor: "#FAFAFA",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography fontSize={14}>{task.title}</Typography>

                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          bgcolor: TaskPriorities.find(p => p.value === task.priority)?.color,
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        {/* SUBMIT */}
        <Grid container display="flex" justifyContent="center">
          <Button
            onClick={handleCreateProject}
            variant="contained"
            size="large"
            sx={{
              mt: 2,
              py: 1.4,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Create Project
          </Button>
        </Grid>
      </Box>

      {/* MODAL */}
      <Dialog open={openTaskModal} onClose={() => setOpenTaskModal(false)}>
        <DialogTitle>Add Task</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Title"
              value={taskForm.title}
              onChange={e => setTaskForm(p => ({ ...p, title: e.target.value }))}
            />
            <TextField
              label="Description"
              multiline
              rows={2}
              value={taskForm.description}
              onChange={e => setTaskForm(p => ({ ...p, description: e.target.value }))}
            />
            <FormControl>
              <InputLabel>Priority</InputLabel>
              <Select
                value={taskForm.priority}
                onChange={e => setTaskForm(p => ({ ...p, priority: e.target.value }))}
              >
                {TaskPriorities.map(p => (
                  <MenuItem key={p.value} value={p.value}>
                    {p.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              type="date"
              label="Deadline"
              InputLabelProps={{ shrink: true }}
              value={taskForm.dueDate}
              onChange={e => setTaskForm(p => ({ ...p, dueDate: e.target.value }))}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenTaskModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddTask}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};