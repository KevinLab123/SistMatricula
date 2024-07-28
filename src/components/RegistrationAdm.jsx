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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
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

const RegistrationAdm = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [newCourse, setNewCourse] = useState({
    grupo_id: '',
    curso_id: '',
    aula: '',
    horario: '',
    precio: '',
  });
  const [deleteCourseId, setDeleteCourseId] = useState('');

  const fetchCourses = async () => {
    setLoading(true);

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
      setCourses(coursesWithNames);
    }
    setLoading(false);
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setNewCourse({
      grupo_id: '',
      curso_id: '',
      aula: '',
      horario: '',
      precio: '',
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewCourse({
      ...newCourse,
      [name]: value,
    });
  };

  const handleDeleteInputChange = (event) => {
    setDeleteCourseId(event.target.value);
  };

  const validateCourse = async (curso_id) => {
    const { data, error } = await supabase
      .from('Cursos')
      .select('Codigo')
      .eq('Codigo', curso_id)
      .single();

    return !!data;
  };

  const handleAddCourse = async () => {
    const { curso_id } = newCourse;

    if (!(await validateCourse(curso_id))) {
      alert('El ID del curso no existe.');
      return;
    }

    const { error } = await supabase
      .from('Clases')
      .insert([newCourse]);

    if (error) {
      console.error('Error adding course:', error);
      alert(`Error al agregar el curso: ${error.message}`);
    } else {
      alert('Curso agregado con éxito.');
      fetchCourses();
      handleCloseDialog();
    }
  };

  const confirmDeleteCourse = () => {
    setConfirmDelete(true);
  };

  const handleDeleteCourse = async () => {
    const { error } = await supabase
      .from('Clases')
      .delete()
      .eq('curso_id', deleteCourseId);

    if (error) {
      setError(error.message);
      console.error('Error deleting course:', error);
    } else {
      setCourses(courses.filter((course) => course.curso_id !== deleteCourseId));
      setDeleteCourseId('');
      setConfirmDelete(false);
    }
  };

  const handleConfirmDelete = () => {
    handleDeleteCourse();
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
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
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenDialog}
        >
          Agregar Curso
        </Button>
      </Box>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Agregar Curso</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Grupo ID"
                variant="outlined"
                name="grupo_id"
                value={newCourse.grupo_id}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="ID del Curso"
                variant="outlined"
                name="curso_id"
                value={newCourse.curso_id}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Aula"
                variant="outlined"
                name="aula"
                value={newCourse.aula}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Horario"
                variant="outlined"
                name="horario"
                value={newCourse.horario}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Precio"
                variant="outlined"
                name="precio"
                value={newCourse.precio}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleAddCourse}
            color="primary"
            variant="contained"
          >
            Agregar
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Eliminar Curso</Typography>
        <TextField
          fullWidth
          label="ID del Curso a Eliminar"
          variant="outlined"
          value={deleteCourseId}
          onChange={handleDeleteInputChange}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={confirmDeleteCourse}
        >
          Eliminar Curso
        </Button>
      </Box>

      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            ¿Estás seguro de que deseas eliminar el curso con ID {deleteCourseId}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>Cancelar</Button>
          <Button
            onClick={handleConfirmDelete}
            color="secondary"
            variant="contained"
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RegistrationAdm;
