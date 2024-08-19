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
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

// Función para convertir números a romanos
const toRoman = (num) => {
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  return romanNumerals[num - 1] || num; // Asegurarse de no pasarse del tamaño del array
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme, estadoCurso }) => {
  let backgroundColor;

  if (estadoCurso === 'Aprobado') {
    backgroundColor = theme.palette.success.light;
  } else if (estadoCurso === 'Reprobado') {
    backgroundColor = theme.palette.error.light;
  }

  return {
    backgroundColor,
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  };
});

const StudyPlan = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = async () => {
    setLoading(true);
    const userId = localStorage.getItem('userId');

    const { data: coursesData, error: coursesError } = await supabase
      .from('Cursos')
      .select('Codigo, Nombre, Descripción, Créditos, Nombre_Carrera');

    if (coursesError) {
      setError(coursesError.message);
      console.error('Error fetching courses:', coursesError);
      setLoading(false);
      return;
    }

    const { data: estadoCursoData, error: estadoCursoError } = await supabase
      .from('EstadoCurso')
      .select('ID_Curso, Estado')
      .eq('Carnet_Estudiante', userId);

    if (estadoCursoError) {
      setError(estadoCursoError.message);
      console.error('Error fetching course states:', estadoCursoError);
      setLoading(false);
      return;
    }

    const combinedData = coursesData.map((course) => {
      const estadoCurso = estadoCursoData.find(
        (estado) => estado.ID_Curso === course.Codigo
      );
      return {
        ...course,
        Estado: estadoCurso ? estadoCurso.Estado : 'Por Cursar',
      };
    });

    setCourses(combinedData);
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Dividir los cursos en grupos de 5
  const groupedCourses = [];
  for (let i = 0; i < courses.length; i += 5) {
    groupedCourses.push(courses.slice(i, i + 5));
  }

  return (
    <TableContainer component={Paper}>
      {groupedCourses.map((courseGroup, groupIndex) => (
        <Card key={groupIndex} variant="outlined" sx={{ marginBottom: 4 }}>
          <CardContent>
            <Typography variant="h6" component="div" align="center" gutterBottom>
              {toRoman(groupIndex + 1)} Cuatrimestre
            </Typography>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Codigo</StyledTableCell>
                  <StyledTableCell align="right">Nombre</StyledTableCell>
                  <StyledTableCell align="right">Descripcion</StyledTableCell>
                  <StyledTableCell align="right">Creditos</StyledTableCell>
                  <StyledTableCell align="right">Carrera</StyledTableCell>
                  <StyledTableCell align="right">Estado</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courseGroup.map((course, index) => (
                  <StyledTableRow key={index} estadoCurso={course.Estado}>
                    <StyledTableCell component="th" scope="row">
                      {course.Codigo}
                    </StyledTableCell>
                    <StyledTableCell align="right">{course.Nombre}</StyledTableCell>
                    <StyledTableCell align="right">{course.Descripción}</StyledTableCell>
                    <StyledTableCell align="right">{course.Créditos}</StyledTableCell>
                    <StyledTableCell align="right">{course.Nombre_Carrera}</StyledTableCell>
                    <StyledTableCell align="right">{course.Estado}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </TableContainer>
  );
};

export default StudyPlan;
