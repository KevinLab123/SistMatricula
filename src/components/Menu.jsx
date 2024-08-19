import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText,
  Container, Grid, Button, Card, CardContent, CssBaseline
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { keyframes } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/client';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

const slideInFromLeft = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const StyledContainer = styled(Container)`
  background-color: #f0f4f8;
  min-height: 100vh;
  padding: 20px;
  overflow: hidden;
`;

const StyledAppBar = styled(AppBar)`
  background-color: ${theme.palette.primary.main};
`;

const StyledTypography = styled(Typography)`
  flex-grow: 1;
`;

const StyledDrawer = styled(Drawer)`
  .MuiPaper-root {
    background-color: ${theme.palette.primary.main};
    color: ${theme.palette.secondary.main};
  }
`;

const StyledCard = styled(Card)`
  background-color: ${theme.palette.secondary.main};
  margin-top: 20px;
  padding: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  animation: ${slideInFromLeft} 1s ease-out;
`;

const StyledButton = styled(Button)`
  height: 100px;
  font-size: 1.2rem;
  transition: transform 0.3s, background-color 0.3s;

  &:hover {
    transform: scale(1.05);
  }
`;

const ROUTES = {
  SIGN: "/",
  MENU: "/menu",
  PLAN: "/studyplan",
  REGISTRATION: '/Registration',
  REGISTRATIONADM: '/RegistrationAdm',
  COURSES: "/courses",
  PLAN_ADMIN: '/StudyAdm',
  STUDENTS: '/Students',
  REQUIREMENTS: '/requirements',
  COURSESTATUS: '/CourseStatus'
};

const Menu = () => {
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const userProfile = localStorage.getItem('userProfile');

  const fetchStudentData = async () => {
    const carnet = localStorage.getItem('userId');
    if (!carnet) {
      setError('No se encontró el carnet del usuario.');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('Estudiantes')
      .select('Carnet, Nombre, Apellido, Telefono')
      .eq('Carnet', carnet)
      .single();

    if (error) {
      setError('Perfil Administrativo');
      setLoading(false);
    } else {
      setStudentData(data);
      setLoading(false);
    }
  };

  const fetchUserEmail = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const { data, error } = await supabase
      .from('Perfiles')
      .select('Email')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user email:', error);
    } else {
      setUserEmail(data.Email);
    }
  };

  useEffect(() => {
    fetchStudentData();
    fetchUserEmail();
  }, []);

  const handleMatriculaClick = () => {
    if (userProfile === 'academico1@ulatina.net') {
      navigate(ROUTES.REGISTRATIONADM);
    } else {
      navigate(ROUTES.REGISTRATION);
    }
  };

  const handlePlanClick = () => {
    if (userProfile === 'academico1@ulatina.net') {
      navigate(ROUTES.PLAN_ADMIN);
    } else {
      navigate(ROUTES.PLAN);
    }
  };

  const handleStatusClick = () => {
    if (userProfile === 'academico1@ulatina.net') {
      navigate(ROUTES.COURSESTATUS);
    }
  };

  const handleCursosClick = () => {
    navigate(ROUTES.COURSES);
  };

  const handleEstudiantesClick = () => {
    navigate(ROUTES.STUDENTS);
  };

  const handleRequirementsClick = () => {
    navigate(ROUTES.REQUIREMENTS);
  };

  const handleLogout = () => {
    // Clear local storage or any other logout actions
    localStorage.removeItem('userProfile');
    localStorage.removeItem('userId');
    // Redirect to Sign component
    navigate(ROUTES.SIGN);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StyledContainer>
        <Grid item xs={12} sm={6} md={4}>
          <StyledAppBar position="static">
            <Toolbar>
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
              <StyledTypography variant="h6">
                Sistema de Matrícula
              </StyledTypography>
            </Toolbar>
          </StyledAppBar>
        </Grid>

        <StyledDrawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          <List>
            {[
              { text: 'Matrícula', onClick: handleMatriculaClick },
              { text: 'Cursos', onClick: handleCursosClick },
              { text: 'Plan de Estudios', onClick: handlePlanClick },
              userProfile === 'admin@ulatina.net' && { text: 'Estudiantes', onClick: handleEstudiantesClick },
              userEmail === 'mentor@ulatina.net' && { text: 'Requisitos', onClick: handleRequirementsClick },
              userEmail === 'academico1@ulatina.net' && { text: 'Estado De Cursos', onClick: handleStatusClick },
              { text: 'Cerrar Sesión', onClick: handleLogout }, // New option added
            ].map((item, index) => (
              item && (
                <ListItem button key={index} onClick={item.onClick}>
                  <ListItemText primary={item.text} />
                </ListItem>
              )
            ))}
          </List>
        </StyledDrawer>

        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12}>
            <StyledCard>
              <CardContent>
                <Typography variant="h5" component="div">
                  Información
                </Typography>
                {loading ? (
                  <Typography variant="body1" color="text.secondary">
                    Cargando...
                  </Typography>
                ) : error ? (
                  <Typography variant="body1" color="text.secondary">
                    {error}
                  </Typography>
                ) : (
                  <>
                    <Typography variant="body1" color="text.secondary">
                      Carnet: {studentData?.Carnet}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Nombre: {studentData?.Nombre}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Apellido: {studentData?.Apellido}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Teléfono: {studentData?.Telefono}
                    </Typography>
                  </>
                )}
              </CardContent>
            </StyledCard>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <StyledButton variant="contained" color="primary" onClick={handleMatriculaClick} fullWidth>
              Matrícula
            </StyledButton>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StyledButton variant="contained" color="primary" onClick={handleCursosClick} fullWidth>
              Cursos
            </StyledButton>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StyledButton variant="contained" color="primary" onClick={handlePlanClick} fullWidth>
              Plan de Estudios
            </StyledButton>
          </Grid>
          {userProfile === 'admin@ulatina.net' && (
            <Grid item xs={12} sm={6} md={4}>
              <StyledButton variant="contained" color="primary" onClick={handleEstudiantesClick} fullWidth>
                Estudiantes
              </StyledButton>
            </Grid>
          )}
          {userEmail === 'mentor@ulatina.net' && (
            <Grid item xs={12} sm={6} md={4}>
              <StyledButton variant="contained" color="primary" onClick={handleRequirementsClick} fullWidth>
                Requisitos
              </StyledButton>
            </Grid>
          )}
          {userEmail === 'academico1@ulatina.net' && (
            <Grid item xs={12} sm={6} md={4}>
              <StyledButton variant="contained" color="primary" onClick={handleStatusClick} fullWidth>
                Estado De Cursos
              </StyledButton>
            </Grid>
          )}
        </Grid>
      </StyledContainer>
    </ThemeProvider>
  );
};

export default Menu;
