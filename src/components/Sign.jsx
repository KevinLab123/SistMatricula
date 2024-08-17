import React, { useState } from 'react';
import { Container, Box, Grid, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/client'; // Asegúrate de que la ruta sea correcta

const ROUTES = {
  SIGN: '/',
  MENU: '/menu',
};

function Sign() {
  const styles = {
    container: {
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background:
        'linear-gradient(to right, rgba(106, 17, 203, 1), rgba(37, 117, 252, 1))',
      padding: '1rem', // Añadido para mejorar el espaciado en pantallas pequeñas
    },
    card: {
      background: '#fff',
      borderRadius: '1rem',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '900px',
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover', // Ajusta la imagen sin distorsión
    },
    formCol: {
      padding: { xs: '1.5rem', sm: '2rem' }, // Padding responsivo
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    heading: {
      fontSize: { xs: '1.8rem', sm: '2rem', md: '2.5rem' }, // Tamaño de fuente responsivo
      textAlign: 'center',
    },
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('Perfiles')
      .select('*')
      .eq('Email', email)
      .eq('Contraseña', password)
      .single();

    if (error) {
      setError('Credenciales incorrectas.');
    } else if (data) {
      const userProfile = data.Email;
      const userId = data.id;
      localStorage.setItem('userProfile', userProfile);
      localStorage.setItem('userId', userId);
      navigate(ROUTES.MENU);
    } else {
      setError('Credenciales incorrectas.');
    }

    setLoading(false);
  };

  return (
    <Container sx={styles.container}>
      <Box sx={styles.card}>
        <Grid container>
          <Grid item xs={12} md={6}>
            <img
              src="https://th.bing.com/th/id/R.4d9c17e6ccb0b763477d5a67a9498c2c?rik=4anFrNkpURgzkQ&pid=ImgRaw&r=0"
              alt="Phone"
              style={styles.image}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={styles.formCol}>
            <Typography variant="h4" sx={styles.heading} gutterBottom>
              CloudWave University
            </Typography>
            <TextField
              label="Correo Institucional"
              variant="outlined"
              margin="normal"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Contraseña"
              variant="outlined"
              type="password"
              margin="normal"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <Typography color="error">{error}</Typography>}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleLogin}
              disabled={loading}
              sx={{ mt: 2 }} // Espaciado superior
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Sign;
