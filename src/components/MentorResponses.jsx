import React, { useState, useEffect } from 'react';
import {
  Container, TextField, Button, List, ListItem, ListItemText,
  Paper, Typography, Box, IconButton, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { supabase } from '../supabase/client'; // Asegúrate de tener el archivo de configuración de supabase

const MentorResponses = () => {
  const [tickets, setTickets] = useState([]);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false); // Estado para controlar la visibilidad del diálogo
  const [selectedTicketId, setSelectedTicketId] = useState(null); // Estado para el ID del ticket seleccionado

  useEffect(() => {
    const fetchTicketsWithStudentNames = async () => {
      // Obtener los tickets
      const { data: ticketsData, error: ticketsError } = await supabase
        .from('Tickets')
        .select('*');

      if (ticketsError) {
        console.error('Error fetching tickets:', ticketsError);
        setLoading(false);
        return;
      }

      // Para cada ticket, obtener el nombre y apellido del estudiante correspondiente
      const ticketsWithStudentNames = await Promise.all(
        ticketsData.map(async (ticket) => {
          const { data: studentData, error: studentError } = await supabase
            .from('Estudiantes')
            .select('Nombre, Apellido') // Seleccionamos el nombre y apellido
            .eq('Carnet', ticket.Carnet_Estudiante) // Usamos Carnet en lugar de Carnet_Estudiante
            .single(); // Aseguramos que sea un solo registro

          if (studentError) {
            console.error('Error fetching student:', studentError);
            return { ...ticket, nombre_estudiante: 'Desconocido', apellido_estudiante: '' };
          }

          // Añadir nombre y apellido al ticket
          return {
            ...ticket,
            nombre_estudiante: studentData?.Nombre || 'Desconocido',
            apellido_estudiante: studentData?.Apellido || '',
          };
        })
      );

      setTickets(ticketsWithStudentNames);

      // Inicializar las respuestas
      const initialResponses = ticketsWithStudentNames.reduce((acc, ticket) => {
        if (!ticket.Respuesta) acc[ticket.Mensaje] = '';
        return acc;
      }, {});

      setResponses(initialResponses);
      setLoading(false);
    };

    fetchTicketsWithStudentNames();
  }, []);

  const handleResponseChange = (mensaje, newResponse) => {
    setResponses((prev) => ({
      ...prev,
      [mensaje]: newResponse
    }));
  };

  const handleSendResponse = async (mensaje) => {
    const newResponse = responses[mensaje];
    const { error } = await supabase
      .from('Tickets')
      .update({ Respuesta: newResponse })
      .match({ Mensaje: mensaje });

    if (error) {
      console.error('Error sending response:', error);
    } else {
      setTickets((prevTickets) =>
        prevTickets.map(ticket =>
          ticket.Mensaje === mensaje
            ? { ...ticket, Respuesta: newResponse }
            : ticket
        )
      );
      handleResponseChange(mensaje, ''); // Limpiar el campo de respuesta
    }
  };

  const handleDeleteTicket = async (id) => {
    const { error } = await supabase
      .from('Tickets')
      .delete()
      .eq('ID_Ticket', id); // Usa la columna ID_Ticket en lugar de id

    if (error) {
      console.error('Error deleting ticket:', error);
    } else {
      setTickets((prevTickets) => prevTickets.filter(ticket => ticket.ID_Ticket !== id));
    }
  };

  const handleOpenDialog = (id) => {
    setSelectedTicketId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTicketId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedTicketId !== null) {
      handleDeleteTicket(selectedTicketId);
      handleCloseDialog();
    }
  };

  return (
    <Container component={Paper} style={{ padding: 20, marginTop: 20, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', borderRadius: 8 }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">Respuestas a Tickets</Typography>

      {loading ? (
        <Typography align="center" color="textSecondary">Cargando...</Typography>
      ) : (
        <List>
          {tickets.map((ticket, index) => (
            <ListItem
              key={index}
              style={{
                marginBottom: 10,
                border: '1px solid #ddd',
                borderRadius: 8,
                padding: 10,
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#fafafa'
              }}
            >
              <ListItemText
                primary={
                  <Typography variant="subtitle1" color="textPrimary">
                    Estudiante: {ticket.nombre_estudiante} {ticket.apellido_estudiante} ({ticket.Carnet_Estudiante})
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="textSecondary">
                    Mensaje: {ticket.Mensaje} <br />
                    Mentor: {ticket.Respuesta || 'No respondido'}
                  </Typography>
                }
              />
              {ticket.Respuesta === null && (
                <Box display="flex" flexDirection="column" ml={2} flexGrow={1}>
                  <TextField
                    variant="outlined"
                    placeholder="Escribe tu respuesta"
                    value={responses[ticket.Mensaje] || ''}
                    onChange={(e) => handleResponseChange(ticket.Mensaje, e.target.value)}
                    fullWidth
                    style={{ marginBottom: 10 }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSendResponse(ticket.Mensaje)}
                    fullWidth
                  >
                    Enviar Respuesta
                  </Button>
                </Box>
              )}
              <IconButton
                aria-label="delete"
                size="large"
                onClick={() => handleOpenDialog(ticket.ID_Ticket)} // Abre el diálogo de confirmación
                color="error"
                style={{ marginLeft: 'auto' }}
              >
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}

      {/* Diálogo de Confirmación */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirmación de Eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar este ticket? Esta acción no se puede deshacer.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MentorResponses;
