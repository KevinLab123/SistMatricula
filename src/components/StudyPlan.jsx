// StudyPlan.jsx
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const StudyPlan = () => {
  // Datos de ejemplo
  const rows = [
    { id: 1, course: 'Calculo 1', teacher: 'Julio Marin', schedule: 'Lunes 10:00 - 12:00' },
    { id: 2, course: 'Física', teacher: 'María López', schedule: 'Martes 14:00 - 16:00' },
    { id: 3, course: 'Química', teacher: 'Carlos Gómez', schedule: 'Miércoles 08:00 - 10:00' },
    // Añade más filas según sea necesario
  ];

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Curso</TableCell>
            <TableCell>Profesor</TableCell>
            <TableCell>Horario</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell>{row.course}</TableCell>
              <TableCell>{row.teacher}</TableCell>
              <TableCell>{row.schedule}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StudyPlan;
