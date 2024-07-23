import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

// Creamos una celda de tabla estilizada usando la función styled de Material UI
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  // Estilo para las celdas de la cabecera
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  // Estilo para las celdas del cuerpo
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

// Creamos una fila de tabla estilizada usando la función styled de Material UI
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // Estilo para las filas impares
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // Ocultamos el borde de la última celda
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

// Función para crear datos de ejemplo
function createData(Curso, Horario, Profesor, Codigo) {
  return { Curso, Horario, Profesor, Codigo };
}

// Datos de ejemplo para llenar la tabla
const rows = [
  createData('BIS06', 'Estructuras De Datos', '5:00/7:30pm', 'Por Asignar'),
  createData('Ice cream sandwich', 237, '5:00/7:30pm', 'John Doe'),
  createData('Eclair', 262, '5:00/7:30pm', 'Jane Smith'),
  createData('Cupcake', 305, '5:00/7:30pm', 'Emily Davis'),
  createData('Gingerbread', 356, '5:00/7:30pm', 'Michael Brown'),
];

// Componente principal que renderiza la tabla
const Registration = () => {
  return (
    // Contenedor de la tabla
    <TableContainer component={Paper}>
      {/* La tabla en sí */}
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        {/* Cabecera de la tabla */}
        <TableHead>
          <TableRow>
            <StyledTableCell>Codigo</StyledTableCell>
            <StyledTableCell align="right">Nombre</StyledTableCell>
            <StyledTableCell align="right">Horario</StyledTableCell>
            <StyledTableCell align="right">Profesor</StyledTableCell>
            <StyledTableCell align="right">Acciones</StyledTableCell>
          </TableRow>
        </TableHead>
        {/* Cuerpo de la tabla */}
        <TableBody>
          {rows.map((row) => (
            // Renderizamos cada fila de datos
            <StyledTableRow key={row.Curso}>
              <StyledTableCell component="th" scope="row">
                {row.Curso}
              </StyledTableCell>
              <StyledTableCell align="right">{row.Horario}</StyledTableCell>
              <StyledTableCell align="right">{row.Profesor}</StyledTableCell>
              <StyledTableCell align="right">{row.Codigo}</StyledTableCell>
              <StyledTableCell align="right">
                <Button color="success" startIcon={<CheckIcon />} />
                <Button color="error" startIcon={<CloseIcon />} />
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// Exportamos el componente para usarlo en otros lugares de la aplicación
export default Registration;
