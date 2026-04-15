import { Box, Container, Tabs, Tab } from "@mui/material";
import { useState } from "react";
import { ProfileHeader } from "./components/ProfileHeader";
import { OverviewTab } from "./components/tabs/OverviewTab";
import { PortfolioTab } from "./components/tabs/PortfolioTab";
import { SkillsTab } from "./components/tabs/SkillsTab";
import { useParams } from "react-router-dom";
import { useGetProfile } from "./hooks/useGetUser";
import { Loader } from "../../common/Loader";
import { Role } from "../Auth/types";
import { ProjectsTab } from "./components/tabs/ProjectsTab";

export const ProfilePage = () => {
  const [tab, setTab] = useState(0);

  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useGetProfile(id ?? '');
  const isMe = id === "me";

  const isFreelancer = (data?.role === Role.FREELANCER);

  if (!data) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        Something went wrong. User not found.
      </Box>
    );
  }

  return (
    <Box sx={{ background: "#f7f7fb", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="md">

      <Loader loading={isLoading} />

      {data && <ProfileHeader user={data}  isEditing={isMe} />}

        <Box sx={{ mt: 3, background: "#fff", borderRadius: 3, p: 2 }}>
          <Tabs value={tab} onChange={(e, v) => setTab(v)}>
            <Tab label="Projects" />
            {isFreelancer && <Tab label="Overview" />}
            {isFreelancer && <Tab label="Skills" />}
            {isFreelancer && <Tab label="Portfolio" />}
          </Tabs>

          <Box sx={{ mt: 2 }}>
            {tab === 0 && <ProjectsTab projects={isFreelancer ? data?.executedProjects : data?.ownedProjects} />}
            {tab === 1 && <OverviewTab user={data} />}
            {tab === 2 && <SkillsTab />}
            {tab === 3 && <PortfolioTab />}
          </Box>
        </Box>

      </Container>
    </Box>
  );
};