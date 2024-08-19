import React, { useState, useEffect } from 'react';
import {
  Container, TextField, Button, List, ListItem, ListItemText,
  Paper, Typography, Box, Grid
} from '@mui/material';
import { supabase } from '../supabase/client'; // Asegúrate de tener el archivo de configuración de supabase

const Tickets = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const carnetEstudiante = localStorage.getItem('userId');
  const userProfile = localStorage.getItem('userProfile');

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('Tickets')
        .select('Carnet_Estudiante, Mensaje, Respuesta')
        .eq('Carnet_Estudiante', carnetEstudiante);

      if (error) console.error('Error fetching messages:', error);
      else setMessages(data);
      
      setLoading(false);
    };

    fetchMessages();
  }, [carnetEstudiante]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const { error } = await supabase
        .from('Tickets')
        .insert([{ Carnet_Estudiante: carnetEstudiante, Mensaje: newMessage }]);
        
      if (error) console.error('Error sending message:', error);
      else {
        setMessages([...messages, { Mensaje: newMessage }]);
        setNewMessage('');
      }
    }
  };

  const handleUpdateResponse = async (messageId, newResponse) => {
    const { error } = await supabase
      .from('Tickets')
      .update({ Respuesta: newResponse })
      .eq('id', messageId); // Asume que la tabla Tickets tiene una columna id para identificar cada registro.

    if (error) console.error('Error updating response:', error);
    else {
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, Respuesta: newResponse } : msg
      ));
    }
  };

  return (
    <Container component={Paper} style={{ padding: 20, marginTop: 20 }}>
      <Typography variant="h5" gutterBottom>Generación De Tickets </Typography>
      
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <List>
              {messages.map((msg, index) => (
                <ListItem key={index}>
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
                <Button variant="contained" color="primary" onClick={handleSendMessage} style={{ marginLeft: 10 }}>
                  Enviar
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
