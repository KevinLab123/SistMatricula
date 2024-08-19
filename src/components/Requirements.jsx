import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import { styled } from '@mui/material/styles';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Button, Checkbox, TextField, Box, Alert, IconButton
} from '@mui/material';
import { green, red } from '@mui/material/colors';
import DeleteIcon from '@mui/icons-material/Delete';
import { tableCellClasses } from '@mui/material/TableCell'; // Añadida importación

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
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
  const [notFoundMessage, setNotFoundMessage] = useState(null);
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
    setNotFoundMessage(null);
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
    <Box sx={{ p: 3 }}>
      {notFoundMessage && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {notFoundMessage}
        </Alert>
      )}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="customized table">
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
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteRequirement(requirement.ID_Curso)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 3 }}>
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
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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
          <span>Estado</span>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddRequirement}
          sx={{ mt: 1 }}
        >
          Agregar Requisito
        </Button>
      </Box>
    </Box>
  );
};

export default Requirements;
