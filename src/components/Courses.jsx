import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { supabase } from '../supabase/client';
import { useEffect, useState } from 'react';

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

const EnrolledCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEnrolledCourses = async () => {
    setLoading(true);
    const userId = localStorage.getItem('userId');

    if (!userId) {
      setError('Error: No se encontró el ID del usuario.');
      setLoading(false);
      return;
    }

    try {
      // Obtener las matrículas del usuario
      const { data: enrollments, error: enrollmentError } = await supabase
        .from('Matrículas')
        .select('curso_id')
        .eq('estudiante_id', userId);

      if (enrollmentError) {
        throw enrollmentError;
      }

      // Obtener los detalles del curso para cada matrícula
      const courseDetailsPromises = enrollments.map(async (enrollment) => {
        const { data: course, error: courseError } = await supabase
          .from('Cursos')
          .select('Nombre')
          .eq('Codigo', enrollment.curso_id)
          .single();

        if (courseError) {
          throw courseError;
        }

        const { data: classDetails, error: classDetailsError } = await supabase
          .from('Clases')
          .select('horario, precio')
          .eq('curso_id', enrollment.curso_id)
          .single();

        if (classDetailsError) {
          throw classDetailsError;
        }

        const { data: carrera, error: carreraError } = await supabase
          .from('Carrera')
          .select('Nombre_Carrera')
          .single(); // Ajusta según la relación entre cursos y carreras

        if (carreraError) {
          throw carreraError;
        }

        return {
          curso_id: enrollment.curso_id,
          nombre_curso: course.Nombre,
          horario: classDetails.horario,
          precio: classDetails.precio,
          nombre_carrera: carrera.Nombre_Carrera,
        };
      });

      const coursesWithDetails = await Promise.all(courseDetailsPromises);
      setCourses(coursesWithDetails);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching enrolled courses:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Carrera</StyledTableCell>
            <StyledTableCell align="right">Código del Curso</StyledTableCell>
            <StyledTableCell align="right">Nombre del Curso</StyledTableCell>
            <StyledTableCell align="right">Horario</StyledTableCell>
            <StyledTableCell align="right">Costo</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {courses.map((course, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell component="th" scope="row">
                {course.nombre_carrera}
              </StyledTableCell>
              <StyledTableCell align="right">{course.curso_id}</StyledTableCell>
              <StyledTableCell align="right">{course.nombre_curso}</StyledTableCell>
              <StyledTableCell align="right">{course.horario}</StyledTableCell>
              <StyledTableCell align="right">{course.precio}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EnrolledCourses;
