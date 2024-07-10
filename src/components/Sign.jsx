import React from "react";
import {Container,Box,Grid,TextField,Button,Typography,} from "@mui/material";
import { useNavigate } from "react-router-dom";

//Definicion local de rutas
const ROUTES = {
  SIGN: "/",
  MENU: "/menu",
};

function Sign() {
  // Definicion de estilos
  const styles = {
    container: {
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background:
        "linear-gradient(to right, rgba(106, 17, 203, 1), rgba(37, 117, 252, 1))",
    },
    card: {
      background: "#fff",
      borderRadius: "1rem",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      maxWidth: "900px",
      overflow: "hidden",
      display: "flex",
    },
    image: {
      width: "100%",
      height: "auto",
    },
    formCol: {
      padding: "2rem",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
  };

  const navigate = useNavigate();

  //Constante que enruta al menu principal
  const handleLogin = () => {
    navigate(ROUTES.MENU);
  };

  return (
    //Se aplican los estilos al todo lo que esta dentro de la etiqueta de contenedor(Imagen)
    <Container style={styles.container}>
      {/* Conetenedor box que actua como div para almacenar las etiquetas */}
      <Box style={styles.card}>
        {/* Almacena las etiquetas que necesitan ser responsivas */}
        <Grid container>
          {/* Configuracion de resposividad  de la imagen */}
          <Grid item xs={12} md={6}>
            {/* logo de la universidad */}
            <img
              src="https://th.bing.com/th/id/R.4d9c17e6ccb0b763477d5a67a9498c2c?rik=4anFrNkpURgzkQ&pid=ImgRaw&r=0"
              alt="Phone"
              style={styles.image}
            />
          </Grid>
          {/* Configuracion de responsividad del titulo, inputs y boton*/}
          <Grid item xs={12} md={6} style={styles.formCol}>
            {/* Titulo principal */}
            <Typography variant="h4" gutterBottom>
              Ingresa tus credenciales
            </Typography>
            {/* Espacio de captura de texto Correo Institucional */}
            <TextField
              label="Correo Institucional"
              variant="outlined"
              margin="normal"
              fullWidth
            />
            {/* Espacio de captura de texto de password */}
            <TextField
              label="Contrasena"
              variant="outlined"
              type="password"
              margin="normal"
              fullWidth
            />
            {/* Boton de ingresar los credenciales */}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleLogin}
            >
              Ingresar
            </Button>
            {/* Cierre de contenedor de config de responsividad de img,iput y boton */}
          </Grid>
          {/* Cierre de contenedor de responsividad */}
        </Grid>
        {/*Cierre de espacio para muestreo de etiquetas */}
      </Box>
      {/* Cierre de contenedor principal */}
    </Container>
  );
}

export default Sign;
