import React, { useState, useEffect } from 'react';
import {
  Container, TextField, Button, List, ListItem, ListItemText,
  Paper, Typography, Box, Grid, Divider
} from '@mui/material';
import { supabase } from '../supabase/client'; // Asegúrate de tener el archivo de configuración de supabase
import SendIcon from '@mui/icons-material/Send'; // Importa el ícono de envío

const Tickets = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const carnetEstudiante = localStorage.getItem('userId');
  const userProfile = localStorage.getItem('userProfile');

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('Tickets')
        .select('*') // Asegúrate de seleccionar todas las columnas necesarias
        .eq('Carnet_Estudiante', carnetEstudiante);

      if (error) {
        setError('Error fetching messages');
        console.error('Error fetching messages:', error);
      } else {
        setMessages(data);
      }
      
      setLoading(false);
    };

    fetchMessages();
  }, [carnetEstudiante]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const { error } = await supabase
        .from('Tickets')
        .insert([{ Carnet_Estudiante: carnetEstudiante, Mensaje: newMessage }]);
        
      if (error) {
        setError('Error sending message');
        console.error('Error sending message:', error);
      } else {
        setMessages([...messages, { Mensaje: newMessage }]);
        setNewMessage('');
        setSuccess('Ticket creado Correctamente');
      }
    }
  };

  const handleUpdateResponse = async (messageId, newResponse) => {
    const { error } = await supabase
      .from('Tickets')
      .update({ Respuesta: newResponse })
      .eq('id', messageId); // Asegúrate de que la tabla Tickets tenga una columna id

    if (error) {
      setError('Error updating response');
      console.error('Error updating response:', error);
    } else {
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, Respuesta: newResponse } : msg
      ));
      setSuccess('Response updated successfully');
    }
  };

  return (
    <Container component={Paper} style={{ padding: 20, marginTop: 20 }}>
      <Typography
        variant="h5"
        align="center"
        color="primary"
        style={{ color: 'blue' }} // Cambia el color del texto a azul
        gutterBottom
      >
      Tickets
      </Typography>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {error && <Typography color="error">{error}</Typography>}
            {success && <Typography color="primary">{success}</Typography>}
            <List>
              {messages.map((msg, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <Grid container alignItems="center">
                      <Grid item xs={12} sm={8}>
                        <ListItemText 
                          primary={msg.Mensaje} 
                          secondary={msg.Respuesta ? `Respuesta: ${msg.Respuesta}` : 'No respondido'} 
                        />
                      </Grid>
                      {userProfile === 'mentor@ulatina.net' && (
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Responder"
                            value={msg.Respuesta || ''}
                            onChange={(e) => handleUpdateResponse(msg.id, e.target.value)}
                          />
                        </Grid>
                      )}
                    </Grid>
                  </ListItem>
                  {index < messages.length - 1 && <Divider />} {/* Agrega un divisor entre mensajes */}
                </React.Fragment>
              ))}
            </List>
          </Grid>
          {userProfile !== 'mentor@ulatina.net' && (
            <Grid item xs={12}>
              <Box display="flex" mt={2}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Escribe tu solicitud"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSendMessage}
                  style={{ marginLeft: 10, display: 'flex', alignItems: 'center' }}
                >
                  Enviar
                  <SendIcon style={{ marginLeft: 5 }} />
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default Tickets;
