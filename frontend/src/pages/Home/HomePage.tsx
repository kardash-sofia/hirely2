import { Box, Button } from "@mui/material"
import { Banner } from "./components/Banner"
import { Features } from "./components/Features"
import { useNavigate } from "react-router-dom"

export const HomePage = () => {

  const navigate = useNavigate();

  const handleGoToProjects = () => {
    navigate('/projects');
  }

  return (
    <>
      <Banner />
      <Features />
      <Box display="flex" justifyContent="center" sx={{ py: 4 }}>
        <Button variant="contained" color="primary" size="large" onClick={handleGoToProjects}>
          Go to projects
        </Button>
      </Box>
    </>
  )
}
