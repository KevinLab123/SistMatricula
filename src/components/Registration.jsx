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

const Registration = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = async () => {
    setLoading(true);
    const userId = localStorage.getItem('userId');

    if (!userId) {
      setError('Error: No se encontró el ID del usuario.');
      setLoading(false);
      return;
    }

    // Obtener los cursos en los que el usuario ya está matriculado
    const { data: enrolledCourses, error: enrollmentError } = await supabase
      .from('Matrículas')
      .select('curso_id')
      .eq('estudiante_id', userId);

    if (enrollmentError) {
      setError(enrollmentError.message);
      console.error('Error fetching enrolled courses:', enrollmentError);
      setLoading(false);
      return;
    }

    const enrolledCourseIds = enrolledCourses.map((matricula) => matricula.curso_id);

    // Obtener todos los cursos disponibles
    const { data, error } = await supabase
      .from('Clases')
      .select('grupo_id, curso_id, aula, horario, precio');

    if (error) {
      setError(error.message);
      console.error('Error fetching courses:', error);
    } else {
      const coursePromises = data.map(async (course) => {
        const { data: courseData, error: courseError } = await supabase
          .from('Cursos')
          .select('Nombre')
          .eq('Codigo', course.curso_id)
          .single();

        if (courseError) {
          console.error('Error fetching course name:', courseError);
          return { ...course, nombre_curso: 'Desconocido' };
        }

        return { ...course, nombre_curso: courseData ? courseData.Nombre : 'Desconocido' };
      });

      const coursesWithNames = await Promise.all(coursePromises);
      // Filtrar los cursos para excluir los ya matriculados
      const availableCourses = coursesWithNames.filter(
        (course) => !enrolledCourseIds.includes(course.curso_id)
      );
      setCourses(availableCourses);
    }
    setLoading(false);
  };

  const handleRegister = async (curso_id) => {
    const confirmation = window.confirm('¿Estás seguro de que quieres matricularte en este curso?');

    if (confirmation) {
      const userId = localStorage.getItem('userId');

      if (!userId) {
        alert('Error: No se encontró el ID del usuario.');
        return;
      }

      const { data, error } = await supabase
        .from('Matrículas')
        .insert([{ estudiante_id: userId, curso_id }]);

      if (error) {
        console.error('Error creating matrícula:', error);
        alert('Error al crear la matrícula.');
      } else {
        alert('Matrícula creada con éxito.');
        // Refrescar la lista de cursos para actualizar la tabla
        fetchCourses();
      }
    }
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
            <StyledTableCell>Grupo</StyledTableCell>
            <StyledTableCell align="right">Nombre del Curso</StyledTableCell>
            <StyledTableCell align="right">ID de Curso</StyledTableCell>
            <StyledTableCell align="right">Aula</StyledTableCell>
            <StyledTableCell align="right">Horario</StyledTableCell>
            <StyledTableCell align="right">Precio</StyledTableCell>
            <StyledTableCell align="right">Acciones</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {courses.map((course, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell component="th" scope="row">
                {course.grupo_id}
              </StyledTableCell>
              <StyledTableCell align="right">{course.nombre_curso}</StyledTableCell>
              <StyledTableCell align="right">{course.curso_id}</StyledTableCell>
              <StyledTableCell align="right">{course.aula}</StyledTableCell>
              <StyledTableCell align="right">{course.horario}</StyledTableCell>
              <StyledTableCell align="right">{course.precio}</StyledTableCell>
              <StyledTableCell align="right">
                <Button
                  color="success"
                  startIcon={<CheckIcon />}
                  onClick={() => handleRegister(course.curso_id)}
                >
                  Matricularse
                </Button>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Registration;
