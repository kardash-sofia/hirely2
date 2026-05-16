import { Box, Container, Tabs, Tab } from "@mui/material";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProfileHeader } from "./components/ProfileHeader";
import { OverviewTab } from "./components/tabs/OverviewTab";
import { PortfolioTab } from "./components/tabs/PortfolioTab";
import { SkillsTab } from "./components/tabs/SkillsTab";
import { useGetProfile } from "./hooks/useGetUser";
import { Loader } from "../../common/Loader";
import { Role } from "../Auth/types";
import { ProjectsTab } from "./components/tabs/ProjectsTab";
import { useAuth } from "../../app/context/AuthContext";
import { ApplicationsTab } from "./components/tabs/ApplicationsTab";

export const ProfilePage = () => {
  const [tab, setTab] = useState(0);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { user: me } = useAuth();
  const { data, isLoading } = useGetProfile(id ?? "");

  const isMe = id === "me";
  const isFreelancer = data?.role === Role.FREELANCER;

  const handleMessage = ()=> {
    if (!data?.id || !me?.id) return;
      navigate(`/chats/newChat/${data.id}`);
  };

  if (isLoading) {
    return <Loader loading={true} />;
  }

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
        <ProfileHeader
          user={data}
          isEditing={isMe}
          isMe={isMe}
          onMessage={handleMessage}
        />

        <Box sx={{ mt: 3, background: "#fff", borderRadius: 3, p: 2 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)}>
            <Tab label="Projects" />
            {isFreelancer && <Tab label="Overview" />}
            {isFreelancer && <Tab label="Applications" />}
            {isFreelancer && <Tab label="Skills" />}
            {isFreelancer && <Tab label="Portfolio" />}
          </Tabs>

          <Box sx={{ mt: 2 }}>
            {tab === 0 && (
              <ProjectsTab
                projects={isFreelancer ? data.executedProjects : data.ownedProjects}
              />
            )}
            {tab === 1 && isFreelancer && <OverviewTab user={data} />}
            {tab === 2 && isFreelancer && <ApplicationsTab />}
            {tab === 3 && isFreelancer && <SkillsTab />}
            {tab === 4 && isFreelancer && <PortfolioTab />}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};