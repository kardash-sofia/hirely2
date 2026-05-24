import {
  Drawer,
  Box,
  TextField,
  Button,
  Stack,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import { useSnackbar } from "../../../common/Snackbar/useSnackbar";
import { useGetPlaceholders } from "../hooks/useGetPlaceholders";
import { SnackbarType } from "../../../common/Snackbar/types";
import type { ProfileForm } from "../types";
import type { NamedEntity } from "../../../api/types";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { useNavigate } from "react-router-dom";

type Props = {
  open: boolean;
  onClose: () => void;
  defaultValues: ProfileForm;
  onSuccess: () => void;
  profileId: string;
};

export const ProfileEditDrawer = ({
  open,
  onClose,
  defaultValues,
  onSuccess,
  profileId,
}: Props) => {
  const { showSnackbar } = useSnackbar();

  const { data: placeholders } = useGetPlaceholders();
  const { mutate } = useUpdateProfile();

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues]);

  const onSubmit = async (formData: ProfileForm) => {
    mutate({
        id: profileId,
        body: formData,
    },
    { 
        onSuccess: () => {
            showSnackbar("Profile updated successfully!", SnackbarType.SUCCESS);
            navigate("/profile/me");
            onSuccess();
            onClose();
        },
        onError: (error: Error) => {            
            showSnackbar(
                `Failed to update profile. Please try again. ${error.message}`,
                SnackbarType.ERROR
            );
        },
    });
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 420, p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            
            {/* BIO */}
            <Controller
              name="bio"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Bio" multiline rows={3} />
              )}
            />

            {/* LOCATION */}
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Location" />
              )}
            />

            {/* HOURLY RATE */}
            <Controller
              name="hourlyRate"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Hourly Rate" />
              )}
            />

            {/* EXPERIENCE */}
            <Controller
              name="experienceLevel"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Experience Level" />
              )}
            />

            {/* SKILLS */}
            <Controller
              name="skillIds"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  multiple
                  options={placeholders?.skills || []}
                  getOptionLabel={(o) => o.name}
                  value={placeholders?.skills.filter((s: NamedEntity) =>
                    field.value?.includes(s.id)
                  )}
                  onChange={(_, value) =>
                    field.onChange(value.map((v) => v.id))
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Skills" />
                  )}
                />
              )}
            />

            {/* TECHNOLOGIES */}
            <Controller
              name="technologyIds"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  multiple
                  options={placeholders?.technologies || []}
                  getOptionLabel={(o) => o.name}
                  value={placeholders?.technologies.filter((t: NamedEntity) =>
                    field.value?.includes(t.id)
                  )}
                  onChange={(_, value) =>
                    field.onChange(value.map((v) => v.id))
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Technologies" />
                  )}
                />
              )}
            />

            {/* CATEGORIES */}
            {/* <Controller
              name="categoryIds"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  multiple
                  options={placeholders?.categories || []}
                  getOptionLabel={(o) => o.name}
                  value={placeholders?.categories.filter((c: NamedEntity) =>
                    field.value?.includes(c.id)
                  )}
                  onChange={(_, value) =>
                    field.onChange(value.map((v) => v.id))
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Categories" />
                  )}
                />
              )}
            /> */}

            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <CircularProgress size={20} />
              ) : (
                "Save changes"
              )}
            </Button>
          </Stack>
        </form>
      </Box>
    </Drawer>
  );
};