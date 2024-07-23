// Importamos React y los módulos necesarios de Material UI
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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
//
function createData(Curso, Horario, Profesor, Codigo, protein) {
  return { Curso, Horario, Profesor, Codigo, protein };
}

// Datos de ejemplo para llenar la tabla cada createData es una fila 
const rows = [
  
  createData('BIS06', 'Estructuras De Datos', '5:00/7:30pm','Por Asignar' ),
  createData('BIS03', 'Programacion I','7:45/10:15PM','Por Asignar'),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

// Componente principal que renderiza la tabla
const Courses = () => {
  return (
    // Contenedor de la tabla
    <TableContainer component={Paper}>
      {/* La tabla en sí */}
      <Table sx={{ minWidth:  700 }} aria-label="customized table">
        {/* Cabecera de la tabla */}
        <TableHead>
          <TableRow>
            <StyledTableCell>Codigo</StyledTableCell>
            <StyledTableCell align="right">Nombre</StyledTableCell>
            <StyledTableCell align="right">Creditos</StyledTableCell>
            <StyledTableCell align="right">Cuatrimestre</StyledTableCell>
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
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// Exportamos el componente para usarlo en otros lugares de la aplicación
export default Courses;
