import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";

import { Loader } from "../../../common/Loader";
import { useSnackbar } from "../../../common/Snackbar/useSnackbar";
import { SnackbarType } from "../../../common/Snackbar/types";
import { useCreateProject } from "../hooks/useCreateProject";
import { useGetConstants } from "../hooks/useGetConstants";
import { useProjectAiAssistant } from "../hooks/useProjectAiAssistant";
import type { CreateTaskType } from "../../../api/services/Projects/types";
import { TaskPriorities } from "../types";

type FormState = {
  title: string;
  description: string;
  categories: string[];
  technologies: string[];
  dueDate: string;
  budget: string;
  image: File | null;
};

type AiPreviewState = {
  predictedCategory: string;
  estimatedBudget: number | null;
  recommendedMin: number | null;
  recommendedMax: number | null;
  generatedDescription: string;
  requirements: string[];
  deliverables: string[];
  recommendedSkills: string[];
};

const initialForm: FormState = {
  title: "",
  description: "",
  categories: [],
  technologies: [],
  dueDate: "",
  budget: "",
  image: null,
};

const initialAiPreview: AiPreviewState = {
  predictedCategory: "",
  estimatedBudget: null,
  recommendedMin: null,
  recommendedMax: null,
  generatedDescription: "",
  requirements: [],
  deliverables: [],
  recommendedSkills: [],
};

export const CreateProject = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const { data: constants, isLoading: constantsLoading } = useGetConstants();
  const { mutate: createProject, isPending: isCreatingProject } = useCreateProject();

  const {
    predictBudget,
    predictCategory,
    generateDescription,
    isPredictingBudget,
    isPredictingCategory,
    isGeneratingDescription,
  } = useProjectAiAssistant();

  const [form, setForm] = useState<FormState>(initialForm);
  const [tasks, setTasks] = useState<CreateTaskType[]>([]);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState<CreateTaskType>({
    title: "",
    description: "",
    priority: 2,
    dueDate: "",
  });

  const [complexity, setComplexity] = useState<number>(3);
  const [aiPreview, setAiPreview] = useState<AiPreviewState>(initialAiPreview);

  const isAiBusy =
    isPredictingBudget || isPredictingCategory || isGeneratingDescription;

  const selectedCategoryNames = useMemo(() => {
    return (constants?.categories ?? [])
      .filter((item) => form.categories.includes(item.id))
      .map((item) => item.name);
  }, [constants?.categories, form.categories]);

  const selectedTechnologyNames = useMemo(() => {
    return (constants?.technologies ?? [])
      .filter((item) => form.technologies.includes(item.id))
      .map((item) => item.name);
  }, [constants?.technologies, form.technologies]);

  const primaryCategoryName = selectedCategoryNames[0] ?? aiPreview.predictedCategory ?? "";

  const handleChange = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTask = () => {
    if (!taskForm.title.trim()) {
      showSnackbar("Task title is required.", SnackbarType.ERROR);
      return;
    }

    setTasks((prev) => [...prev, taskForm]);
    setTaskForm({
      title: "",
      description: "",
      priority: 2,
      dueDate: "",
    });
    setOpenTaskModal(false);
  };

  const handleRemoveTask = (index: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePredictCategory = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      showSnackbar("Fill title and description before category prediction.", SnackbarType.ERROR);
      return;
    }

    try {
      const result = await predictCategory({
        title: form.title,
        description: form.description,
      });

      setAiPreview((prev) => ({
        ...prev,
        predictedCategory: result.predicted_category,
      }));

      showSnackbar("AI category suggestion generated.", SnackbarType.SUCCESS);
    } catch (error) {
      showSnackbar(
        `Failed to predict category. ${(error as Error).message}`,
        SnackbarType.ERROR
      );
    }
  };

  const handlePredictBudget = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      showSnackbar("Fill title and description before budget prediction.", SnackbarType.ERROR);
      return;
    }

    const categoryForBudget = primaryCategoryName;
    if (!categoryForBudget) {
      showSnackbar(
        "Select a category or run AI category prediction first.",
        SnackbarType.ERROR
      );
      return;
    }

    try {
      const result = await predictBudget({
        title: form.title,
        description: form.description,
        technologies: selectedTechnologyNames,
        category: categoryForBudget,
        complexity,
      });

      setAiPreview((prev) => ({
        ...prev,
        estimatedBudget: result.estimated_budget,
        recommendedMin: result.recommended_min,
        recommendedMax: result.recommended_max,
      }));

      showSnackbar("AI budget suggestion generated.", SnackbarType.SUCCESS);
    } catch (error) {
      showSnackbar(
        `Failed to predict budget. ${(error as Error).message}`,
        SnackbarType.ERROR
      );
    }
  };

  const handleGenerateDescription = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      showSnackbar("Fill title and description before generating description.", SnackbarType.ERROR);
      return;
    }

    const categoryForDescription = primaryCategoryName;
    if (!categoryForDescription) {
      showSnackbar(
        "Select a category or run AI category prediction first.",
        SnackbarType.ERROR
      );
      return;
    }

    try {
      const result = await generateDescription({
        title: form.title,
        short_description: form.description,
        category: categoryForDescription,
        technologies: selectedTechnologyNames,
        complexity,
        predicted_budget: aiPreview.estimatedBudget,
      });

      setAiPreview((prev) => ({
        ...prev,
        generatedDescription: result.expanded_description,
        requirements: result.requirements,
        deliverables: result.deliverables,
        recommendedSkills: result.recommended_skills,
      }));

      showSnackbar("AI description generated.", SnackbarType.SUCCESS);
    } catch (error) {
      showSnackbar(
        `Failed to generate description. ${(error as Error).message}`,
        SnackbarType.ERROR
      );
    }
  };

  const handleRunFullAiAssist = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      showSnackbar("Fill title and description before running AI assist.", SnackbarType.ERROR);
      return;
    }

    try {
      const categoryResult = await predictCategory({
        title: form.title,
        description: form.description,
      });

      const resolvedCategory = categoryResult.predicted_category;

      const budgetResult = await predictBudget({
        title: form.title,
        description: form.description,
        technologies: selectedTechnologyNames,
        category: resolvedCategory,
        complexity,
      });

      const descriptionResult = await generateDescription({
        title: form.title,
        short_description: form.description,
        category: resolvedCategory,
        technologies: selectedTechnologyNames,
        complexity,
        predicted_budget: budgetResult.estimated_budget,
      });

      setAiPreview({
        predictedCategory: resolvedCategory,
        estimatedBudget: budgetResult.estimated_budget,
        recommendedMin: budgetResult.recommended_min,
        recommendedMax: budgetResult.recommended_max,
        generatedDescription: descriptionResult.expanded_description,
        requirements: descriptionResult.requirements,
        deliverables: descriptionResult.deliverables,
        recommendedSkills: descriptionResult.recommended_skills,
      });

      showSnackbar("Full AI assistance completed.", SnackbarType.SUCCESS);
    } catch (error) {
      showSnackbar(
        `AI assist failed. ${(error as Error).message}`,
        SnackbarType.ERROR
      );
    }
  };

  const handleApplyGeneratedDescription = () => {
    if (!aiPreview.generatedDescription) return;

    setForm((prev) => ({
      ...prev,
      description: aiPreview.generatedDescription,
    }));

    showSnackbar("Generated description applied.", SnackbarType.SUCCESS);
  };

  const handleApplyBudgetSuggestion = () => {
    if (!aiPreview.estimatedBudget) return;

    setForm((prev) => ({
      ...prev,
      budget: String(Math.round(aiPreview.estimatedBudget || 0)),
    }));

    showSnackbar("Suggested budget applied.", SnackbarType.SUCCESS);
  };

  const handleApplyPredictedCategory = () => {
    if (!aiPreview.predictedCategory || !constants?.categories?.length) return;

    const matchedCategory = constants.categories.find(
      (item) =>
        item.name.trim().toLowerCase() ===
        aiPreview.predictedCategory.trim().toLowerCase()
    );

    if (!matchedCategory) {
      showSnackbar(
        "Predicted category was not found in available constants.",
        SnackbarType.ERROR
      );
      return;
    }

    setForm((prev) => ({
      ...prev,
      categories: [matchedCategory.id],
    }));

    showSnackbar("Predicted category applied.", SnackbarType.SUCCESS);
  };

  const handleCreateProject = () => {
    if (!form.title.trim()) {
      showSnackbar("Project title is required.", SnackbarType.ERROR);
      return;
    }

    if (!form.categories.length) {
      showSnackbar("Select at least one category.", SnackbarType.ERROR);
      return;
    }

    const numericBudget = Number(form.budget);
    const hasBudget = Number.isFinite(numericBudget) && numericBudget > 0;

    const payload = {
      title: form.title,
      description: form.description || undefined,
      budgetMin: hasBudget ? numericBudget : undefined,
      budgetMax: hasBudget ? numericBudget + 200 : undefined,
      categoryIds: form.categories,
      technologyIds: form.technologies,
      tasks,
    };

    createProject(payload, {
      onSuccess: () => {
        showSnackbar("Project created successfully!", SnackbarType.SUCCESS);
        navigate("/projects");
      },
      onError: (error: Error) => {
        showSnackbar(
          `Failed to create project. Please try again. ${error.message}`,
          SnackbarType.ERROR
        );
      },
    });
  };

  if (constantsLoading) {
    return <Loader loading={constantsLoading} />;
  }

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
      <Stack spacing={1} mb={4}>
        <Typography variant="h4" fontWeight={800}>
          Create Project
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Fill in the project details and optionally use AI to improve the draft.
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack spacing={3}>
                <TextField
                  label="Project title"
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  fullWidth
                />

                <TextField
                  label="Short description"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  fullWidth
                  multiline
                  minRows={5}
                  helperText="Write a short draft first. AI can then improve it."
                />

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>Categories</InputLabel>
                      <Select
                        multiple
                        value={form.categories}
                        onChange={(e) =>
                          handleChange("categories", e.target.value as string[])
                        }
                        input={<OutlinedInput label="Categories" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
                            {(selected as string[]).map((id) => {
                              const category = constants?.categories.find((c) => c.id === id);
                              return (
                                <Chip
                                  key={id}
                                  size="small"
                                  label={category?.name ?? id}
                                />
                              );
                            })}
                          </Box>
                        )}
                      >
                        {constants?.categories.map((c) => (
                          <MenuItem key={c.id} value={c.id}>
                            {c.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>Technologies</InputLabel>
                      <Select
                        multiple
                        value={form.technologies}
                        onChange={(e) =>
                          handleChange("technologies", e.target.value as string[])
                        }
                        input={<OutlinedInput label="Technologies" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
                            {(selected as string[]).map((id) => {
                              const tech = constants?.technologies.find((t) => t.id === id);
                              return (
                                <Chip
                                  key={id}
                                  size="small"
                                  label={tech?.name ?? id}
                                />
                              );
                            })}
                          </Box>
                        )}
                      >
                        {constants?.technologies.map((t) => (
                          <MenuItem key={t.id} value={t.id}>
                            {t.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Due date"
                      type="date"
                      value={form.dueDate}
                      onChange={(e) => handleChange("dueDate", e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Budget"
                      type="number"
                      value={form.budget}
                      onChange={(e) => handleChange("budget", e.target.value)}
                      fullWidth
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Complexity"
                      type="number"
                      value={complexity}
                      onChange={(e) => setComplexity(Number(e.target.value))}
                      inputProps={{ min: 1, max: 5 }}
                      fullWidth
                      helperText="Scale from 1 to 5"
                    />
                  </Grid>
                </Grid>

                <Box>
                  <Typography variant="subtitle1" fontWeight={700} mb={1}>
                    Project image
                  </Typography>
                  <Button variant="outlined" component="label">
                    Upload image
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleChange("image", e.target.files?.[0] ?? null)}
                    />
                  </Button>

                  {form.image && (
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      {form.image.name}
                    </Typography>
                  )}
                </Box>
              </Stack>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h6" fontWeight={700}>
                  Tasks
                </Typography>

                <Button variant="outlined" onClick={() => setOpenTaskModal(true)}>
                  + Add task
                </Button>
              </Stack>

              {tasks.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No tasks added yet.
                </Typography>
              ) : (
                <Stack spacing={1.5}>
                  {tasks.map((task, index) => (
                    <Card
                      key={`${task.title}-${index}`}
                      variant="outlined"
                      sx={{ borderRadius: 3 }}
                    >
                      <CardContent>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          justifyContent="space-between"
                          spacing={1}
                        >
                          <Box>
                            <Typography fontWeight={700}>{task.title}</Typography>
                            <Typography variant="body2" color="text.secondary" mt={0.5}>
                              {task.description || "No description"}
                            </Typography>
                            {task.dueDate && (
                              <Typography variant="caption" color="text.secondary">
                                Due: {task.dueDate}
                              </Typography>
                            )}
                          </Box>

                          <Stack direction="row" spacing={1} alignItems="flex-start">
                            <Chip
                              label={
                                TaskPriorities.find((p) => p.value === task.priority)?.label ??
                                "Priority"
                              }
                              sx={{
                                color: "#fff",
                                backgroundColor:
                                  TaskPriorities.find((p) => p.value === task.priority)?.color,
                              }}
                            />
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleRemoveTask(index)}
                            >
                              Remove
                            </Button>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </Paper>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              position: "sticky",
              top: 24,
            }}
          >
            <Stack spacing={2.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <AutoAwesomeRoundedIcon color="primary" />
                <Typography variant="h6" fontWeight={800}>
                  AI Assistant
                </Typography>
              </Stack>

              <Typography variant="body2" color="text.secondary">
                Use AI to suggest category, budget and a more complete project description.
              </Typography>

              <Alert severity="info">
                AI works best when title, short description and technologies are already filled in.
              </Alert>

              <Button
                variant="contained"
                startIcon={
                  isAiBusy ? <CircularProgress size={18} color="inherit" /> : <AutoAwesomeRoundedIcon />
                }
                onClick={handleRunFullAiAssist}
                disabled={isAiBusy}
                sx={{ borderRadius: 3, py: 1.25 }}
              >
                Run full AI assist
              </Button>

              <Divider />

              <Stack spacing={1.5}>
                <Button
                  variant="outlined"
                  startIcon={<CategoryRoundedIcon />}
                  onClick={handlePredictCategory}
                  disabled={isAiBusy}
                >
                  Predict category
                </Button>

                {aiPreview.predictedCategory && (
                  <Card variant="outlined" sx={{ borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                        Suggested category
                      </Typography>
                      <Typography fontWeight={700}>{aiPreview.predictedCategory}</Typography>
                      <Button
                        size="small"
                        sx={{ mt: 1 }}
                        onClick={handleApplyPredictedCategory}
                      >
                        Apply
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </Stack>

              <Stack spacing={1.5}>
                <Button
                  variant="outlined"
                  startIcon={<PaidRoundedIcon />}
                  onClick={handlePredictBudget}
                  disabled={isAiBusy}
                >
                  Predict budget
                </Button>

                {aiPreview.estimatedBudget !== null && (
                  <Card variant="outlined" sx={{ borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                        Budget suggestion
                      </Typography>
                      <Typography fontWeight={800}>
                        ~ {Math.round(aiPreview.estimatedBudget)} USD
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mt={0.75}>
                        Recommended range:{" "}
                        {Math.round(aiPreview.recommendedMin ?? 0)} –{" "}
                        {Math.round(aiPreview.recommendedMax ?? 0)} USD
                      </Typography>
                      <Button
                        size="small"
                        sx={{ mt: 1 }}
                        onClick={handleApplyBudgetSuggestion}
                      >
                        Apply
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </Stack>

              <Stack spacing={1.5}>
                <Button
                  variant="outlined"
                  startIcon={<DescriptionRoundedIcon />}
                  onClick={handleGenerateDescription}
                  disabled={isAiBusy}
                >
                  Generate description
                </Button>

                {aiPreview.generatedDescription && (
                  <Card variant="outlined" sx={{ borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" mb={1}>
                        Generated description
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          whiteSpace: "pre-line",
                          display: "-webkit-box",
                          WebkitLineClamp: 10,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {aiPreview.generatedDescription}
                      </Typography>

                      {!!aiPreview.requirements.length && (
                        <Box mt={2}>
                          <Typography variant="subtitle2" fontWeight={700} mb={1}>
                            Requirements
                          </Typography>
                          <Stack direction="row" gap={1} flexWrap="wrap">
                            {aiPreview.requirements.map((item) => (
                              <Chip key={item} label={item} size="small" />
                            ))}
                          </Stack>
                        </Box>
                      )}

                      {!!aiPreview.deliverables.length && (
                        <Box mt={2}>
                          <Typography variant="subtitle2" fontWeight={700} mb={1}>
                            Deliverables
                          </Typography>
                          <Stack direction="row" gap={1} flexWrap="wrap">
                            {aiPreview.deliverables.map((item) => (
                              <Chip key={item} label={item} size="small" />
                            ))}
                          </Stack>
                        </Box>
                      )}

                      {!!aiPreview.recommendedSkills.length && (
                        <Box mt={2}>
                          <Typography variant="subtitle2" fontWeight={700} mb={1}>
                            Recommended skills
                          </Typography>
                          <Stack direction="row" gap={1} flexWrap="wrap">
                            {aiPreview.recommendedSkills.map((item) => (
                              <Chip key={item} label={item} size="small" color="primary" variant="outlined" />
                            ))}
                          </Stack>
                        </Box>
                      )}

                      <Button
                        size="small"
                        sx={{ mt: 2 }}
                        onClick={handleApplyGeneratedDescription}
                      >
                        Apply to description
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </Stack>

              <Divider />

              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateProject}
                disabled={isCreatingProject || isAiBusy}
                sx={{ borderRadius: 3, py: 1.4 }}
              >
                {isCreatingProject ? "Creating..." : "Create project"}
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={openTaskModal}
        onClose={() => setOpenTaskModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add task</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Task title"
              value={taskForm.title}
              onChange={(e) =>
                setTaskForm((prev) => ({ ...prev, title: e.target.value }))
              }
              fullWidth
            />

            <TextField
              label="Task description"
              value={taskForm.description}
              onChange={(e) =>
                setTaskForm((prev) => ({ ...prev, description: e.target.value }))
              }
              fullWidth
              multiline
              minRows={3}
            />

            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={taskForm.priority}
                label="Priority"
                onChange={(e) =>
                  setTaskForm((prev) => ({
                    ...prev,
                    priority: Number(e.target.value),
                  }))
                }
              >
                {TaskPriorities.map((priority) => (
                  <MenuItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Due date"
              type="date"
              value={taskForm.dueDate}
              onChange={(e) =>
                setTaskForm((prev) => ({ ...prev, dueDate: e.target.value }))
              }
              InputLabelProps={{ shrink: true }}
              fullWidth
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