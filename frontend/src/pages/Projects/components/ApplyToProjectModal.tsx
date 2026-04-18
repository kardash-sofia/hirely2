import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useCreateProjectApplication } from "../hooks/useCreateProjectApplication";
import { useSnackbar } from "../../../common/Snackbar/useSnackbar";
import { SnackbarType } from "../../../common/Snackbar/types";

type Props = {
  open: boolean;
  onClose: () => void;
  projectId: string;
  projectTitle?: string;
};

export const ApplyToProjectModal = ({
  open,
  onClose,
  projectId,
  projectTitle,
}: Props) => {
  const [coverLetter, setCoverLetter] = useState("");
  const { mutate, isPending } = useCreateProjectApplication();
  const { showSnackbar } = useSnackbar();

  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  const handleSubmit = () => {
    mutate(
      { projectId, coverLetter },
      {
        onSuccess: () => {
          showSnackbar("Application sent successfully", SnackbarType.SUCCESS);
          setCoverLetter("");
          onClose();
        },
        onError: (error: Error) => {
          showSnackbar(error.message || "Failed to send application", SnackbarType.ERROR);
        },
      }
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ pb: 1 }}>
        Apply to Project
      </DialogTitle>

      <DialogContent>
        {projectTitle && (
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {projectTitle}
          </Typography>
        )}

        <Box sx={{ mt: 1 }}>
          <TextField
            fullWidth
            multiline
            minRows={5}
            maxRows={10}
            label="Cover letter"
            placeholder="Tell the client why you are a good fit for this project..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={isPending}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isPending}
        >
          Send Application
        </Button>
      </DialogActions>
    </Dialog>
  );
};