import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/client'; // Asegúrate de que la ruta sea correcta
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import { green, red } from '@mui/material/colors';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert'; // Asegúrate de que has importado Alert

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const Requirements = () => {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFoundMessage, setNotFoundMessage] = useState(null); // Estado para el mensaje de no encontrado
  const [newRequirement, setNewRequirement] = useState({
    ID_Curso: '',
    Carnet_Estudiante: '',
    Estado: false,
  });

  const fetchRequirements = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('Requisitos')
      .select('ID_Curso, Carnet_Estudiante, Estado');

    if (error) {
      console.error('Error fetching requirements:', error);
    } else {
      setRequirements(data);
    }
    setLoading(false);
  };

  const handleAddRequirement = async () => {
    const { data, error } = await supabase
      .from('Requisitos')
      .insert([newRequirement]);

    if (error) {
      console.error('Error adding requirement:', error);
    } else {
      setNewRequirement({
        ID_Curso: '',
        Carnet_Estudiante: '',
        Estado: false,
      });
      fetchRequirements();
    }
  };

  const handleDeleteRequirement = async (id) => {
    setNotFoundMessage(null); // Limpiar el mensaje de no encontrado

    const { data, error } = await supabase
      .from('Requisitos')
      .delete()
      .eq('ID_Curso', id);

    if (error) {
      console.error('Error deleting requirement:', error);
    } else if (data && data.length === 0) {
      setNotFoundMessage('Código no encontrado');
    } else {
      fetchRequirements();
    }
  };

  const handleStatusChange = async (id, newState) => {
    const { data, error } = await supabase
      .from('Requisitos')
      .update({ Estado: newState })
      .eq('ID_Curso', id);

    if (error) {
      console.error('Error updating requirement status:', error);
    } else {
      fetchRequirements();
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, []);

  if (loading) return <p>Loading...</p>;
  
  return (
    <Box sx={{ p: 2 }}>
      {notFoundMessage && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {notFoundMessage}
        </Alert>
      )}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>ID Curso</StyledTableCell>
              <StyledTableCell align="right">Carnet Estudiante</StyledTableCell>
              <StyledTableCell align="right">Estado</StyledTableCell>
              <StyledTableCell align="right">Acciones</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requirements.map((requirement) => (
              <StyledTableRow key={requirement.ID_Curso}>
                <StyledTableCell component="th" scope="row">
                  {requirement.ID_Curso}
                </StyledTableCell>
                <StyledTableCell align="right">{requirement.Carnet_Estudiante}</StyledTableCell>
                <StyledTableCell align="right">
                  <Checkbox
                    checked={requirement.Estado}
                    onChange={(e) => handleStatusChange(requirement.ID_Curso, e.target.checked)}
                    sx={{
                      color: requirement.Estado ? green[600] : red[600],
                      '&.Mui-checked': {
                        color: requirement.Estado ? green[600] : red[600],
                      },
                    }}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteRequirement(requirement.ID_Curso)}
                  >
                    Eliminar
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2 }}>
        <TextField
          label="ID Curso"
          variant="outlined"
          value={newRequirement.ID_Curso}
          onChange={(e) => setNewRequirement({ ...newRequirement, ID_Curso: e.target.value })}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Carnet Estudiante"
          variant="outlined"
          value={newRequirement.Carnet_Estudiante}
          onChange={(e) => setNewRequirement({ ...newRequirement, Carnet_Estudiante: e.target.value })}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Checkbox
          checked={newRequirement.Estado}
          onChange={(e) => setNewRequirement({ ...newRequirement, Estado: e.target.checked })}
          sx={{
            color: newRequirement.Estado ? green[600] : red[600],
            '&.Mui-checked': {
              color: newRequirement.Estado ? green[600] : red[600],
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddRequirement}
        >
          Agregar Requisito
        </Button>
      </Box>
    </Box>
  );
};

export default Requirements;
