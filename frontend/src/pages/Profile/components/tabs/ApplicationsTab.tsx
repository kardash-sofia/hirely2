import { Typography } from "@mui/material";
import { Loader } from "../../../../common/Loader";
import { useGetMyApplications } from "../../hooks/useGetMyApplications";
import { HorizontalScroll } from "../../../../common/HorizontalScroll/HorizontalScroll";
import { ApplicationCard } from "../items/ApplicationCard";

export const ApplicationsTab = () => {
  const { data = [], isLoading } = useGetMyApplications();

  if (isLoading) return <Loader loading={isLoading} />;

  return (      
      <HorizontalScroll>
        {data.length ? (
          data.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              mode="freelancer"
            />
          ))
        ) : (
          <Typography color="text.secondary">
            You have not applied to any projects yet.
          </Typography>
        )}
      </HorizontalScroll>
  );
};