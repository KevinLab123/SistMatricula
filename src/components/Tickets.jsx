import React, { useState, useEffect } from 'react';
import {
  Container, TextField, Button, List, ListItem, ListItemText,
  Paper, Typography, Box, Grid, Divider, IconButton
} from '@mui/material';
import { supabase } from '../supabase/client'; // Asegúrate de tener el archivo de configuración de supabase
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';

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
        .select('id, Carnet_Estudiante, Mensaje, Respuesta')
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
    <Container component={Paper} style={{ padding: 20, marginTop: 20, borderRadius: 8 }}>
      <Typography variant="h5" gutterBottom align="center" color="primary">Tickets</Typography>
      
      {loading ? (
        <Typography align="center">Loading...</Typography>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <List>
              {messages.map((msg) => (
                <ListItem key={msg.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <Grid container alignItems="center">
                    <Grid item xs={12} sm={8}>
                      <ListItemText 
                        primary={<Typography variant="body1">{msg.Mensaje}</Typography>}
                        secondary={
                          <Typography variant="body2" color="textSecondary">
                            {msg.Respuesta ? `Respuesta: ${msg.Respuesta}` : 'No respondido'}
                          </Typography>
                        }
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
                          size="small"
                          InputProps={{
                            endAdornment: (
                              <IconButton onClick={() => handleUpdateResponse(msg.id, msg.Respuesta)}>
                                <EditIcon />
                              </IconButton>
                            ),
                          }}
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
              <Box display="flex" alignItems="center" mt={2} p={1} style={{ borderRadius: 8, backgroundColor: '#f5f5f5' }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Escribe tu solicitud"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  size="small"
                  style={{ marginRight: 10 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSendMessage}
                  endIcon={<SendIcon />}
                >
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
