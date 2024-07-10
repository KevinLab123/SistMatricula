import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText,
  Container, Grid, Button, Card, CardContent, CssBaseline
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { keyframes } from '@emotion/react';
import { useNavigate } from 'react-router-dom';  

// Tema personalizado con paleta de colores azul y blanco
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3', // Azul principal
    },
    secondary: {
      main: '#ffffff', // Blanco
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

// Animación personalizada
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

// Estilos personalizados utilizando MUI's `styled`
const StyledContainer = styled(Container)`
  background-color: #f0f4f8; /* Azul claro de fondo */
  min-height: 100vh;
  padding: 20px;
  overflow: hidden; /* Evita el desbordamiento de animaciones */
`;

const StyledAppBar = styled(AppBar)`
  background-color: ${theme.palette.primary.main}; /* Color de fondo del AppBar */
`;

const StyledTypography = styled(Typography)`
  flex-grow: 1; /* Hace que el texto crezca y ocupe todo el espacio restante */
`;

const StyledDrawer = styled(Drawer)`
  .MuiPaper-root {
    background-color: ${theme.palette.primary.main}; /* Color de fondo del Drawer */
    color: ${theme.palette.secondary.main}; /* Color del texto del Drawer */
  }
`;

const StyledCard = styled(Card)`
  background-color: ${theme.palette.secondary.main}; /* Color de fondo del Card */
  margin-top: 20px;
  padding: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); /* Sombra del Card */
  animation: ${slideInFromLeft} 1s ease-out; /* Animación al entrar */
`;

const StyledButton = styled(Button)`
  height: 100px; /* Altura del botón */
  font-size: 1.2rem; /* Tamaño de fuente del botón */
  transition: transform 0.3s, background-color 0.3s; /* Transiciones al hacer hover */

  &:hover {
    transform: scale(1.05); /* Efecto de escalar al hacer hover */
  }
`;

const ROUTES = {
  SIGN: "/",
  MENU: "/menu",
  PLAN: "/studyplan"
};

const Menu = () => {
  const navigate = useNavigate();

  // Estado para controlar si el Drawer está abierto o cerrado
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Función para alternar el estado del Drawer (abrir o cerrar)
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  // Manejadores de eventos para los ítems del Drawer
  const handleMatriculaClick = () => {
    console.log('Matrícula'); 
  };

  const handleCursosClick = () => {
    console.log('Cursos');
    navigate(ROUTES.PLAN);
  };

  const handlePlanDeEstudiosClick = () => {
    console.log('Plan de Estudios');
  };

  return (
    // Aplicación del tema personalizado sobre los elementos
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normaliza los estilos entre diferentes navegadores */}
      <StyledContainer>
        {/* Barra de navegación superior */}
        <StyledAppBar position="static">
          <Toolbar>
            {/* Icono de menú que abre el Drawer */}
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            {/* Título en la barra de navegación */}
            <StyledTypography variant="h6">
              Sistema de Matrícula
            </StyledTypography>
          </Toolbar>
        </StyledAppBar>

        {/* Drawer (panel lateral) que contiene opciones de navegación */}
        <StyledDrawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          <List>
            {/* Lista de opciones en el Drawer */}
            {[
              { text: 'Matrícula', onClick: handleMatriculaClick },
              { text: 'Cursos', onClick: handleCursosClick },
              { text: 'Plan de Estudios', onClick: handlePlanDeEstudiosClick },
            ].map((item, index) => (
              // Cada ítem es un ListItem que ejecuta la función onClick correspondiente
              <ListItem button key={index} onClick={item.onClick}>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </StyledDrawer>

        {/* Contenedor principal de la página */}
        <Grid container spacing={3} justifyContent="center">
          {/* Tarjeta con información del estudiante */}
          <Grid item xs={12}>
            <StyledCard>
              <CardContent>
                <Typography variant="h5" component="div">
                  Información del Estudiante
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Nombre Completo: John Doe
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Carnet: 123456
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          
          {/* Botones para acciones principales */}
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
            <StyledButton variant="contained" color="primary" onClick={handlePlanDeEstudiosClick} fullWidth>
              Plan de Estudios
            </StyledButton>
          </Grid>
        </Grid>
      </StyledContainer>
    </ThemeProvider>
  );
};

export default Menu;
