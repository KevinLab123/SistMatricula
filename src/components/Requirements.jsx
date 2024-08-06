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
  const [error, setError] = useState(null);

  const fetchRequirements = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('Requisitos') // Asegúrate de que el nombre de la tabla sea correcto
      .select('ID_Curso, Carnet_Estudiante, Estado');

    if (error) {
      setError(error.message);
      console.error('Error fetching requirements:', error);
    } else {
      console.log('Fetched data:', data); // Verifica los datos obtenidos
      setRequirements(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequirements();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>ID Curso</StyledTableCell>
            <StyledTableCell align="right">Carnet Estudiante</StyledTableCell>
            <StyledTableCell align="right">Estado</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requirements.map((requirement, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell component="th" scope="row">
                {requirement.ID_Curso}
              </StyledTableCell>
              <StyledTableCell align="right">{requirement.Carnet_Estudiante}</StyledTableCell>
              <StyledTableCell align="right">
                {requirement.Estado ? 'Cumple' : 'No cumple'}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Requirements;
