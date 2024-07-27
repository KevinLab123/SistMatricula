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

const StudyPlan = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('Cursos')
      .select('Codigo, Nombre, Descripción, Créditos, Nombre_Carrera');

    if (error) {
      setError(error.message);
      console.error('Error fetching courses:', error);
    } else {
      console.log('Fetched data:', data); // Verifica los datos obtenidos
      setCourses(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Codigo</StyledTableCell>
            <StyledTableCell align="right">Nombre</StyledTableCell>
            <StyledTableCell align="right">Descripcion</StyledTableCell>
            <StyledTableCell align="right">Creditos</StyledTableCell>
            <StyledTableCell align="right">Carrera</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {courses.map((course, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell component="th" scope="row">
                {course.Codigo}
              </StyledTableCell>
              <StyledTableCell align="right">{course.Nombre}</StyledTableCell>
              <StyledTableCell align="right">{course.Descripción}</StyledTableCell>
              <StyledTableCell align="right">{course.Créditos}</StyledTableCell>
              <StyledTableCell align="right">{course.Nombre_Carrera}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StudyPlan;
