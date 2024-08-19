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
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert'; // Asegúrate de que has importado Alert
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

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

const CourseStatus = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Estado para el mensaje de error
  const [newStatus, setNewStatus] = useState({
    ID_Curso: '',
    Carnet_Estudiante: '',
    Estado: 'Aprobado',
  });

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('EstadoCurso')
        .select('ID_Curso, Carnet_Estudiante, Estado');

      if (error) throw error;
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Error fetching courses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStatus = async () => {
    try {
      const { data: studentData, error: studentError } = await supabase
        .from('Estudiantes')
        .select('Carnet')
        .eq('Carnet', newStatus.Carnet_Estudiante);

      if (studentError) throw studentError;
      if (studentData.length === 0) {
        setError('Estudiante no encontrado');
        return;
      }

      const { data, error } = await supabase
        .from('EstadoCurso')
        .insert([newStatus]);

      if (error) throw error;
      setNewStatus({
        ID_Curso: '',
        Carnet_Estudiante: '',
        Estado: 'Aprobado',
      });
      fetchCourses();
    } catch (error) {
      console.error('Error adding status:', error);
      setError('Datos Incorrectos');
    }
  };

  const handleDeleteStatus = async (id) => {
    try {
      const { data, error } = await supabase
        .from('EstadoCurso')
        .delete()
        .eq('ID_Curso', id);
  
      if (error) throw error;
  
      // Verifica si realmente se eliminó algún registro
      if (data.length === 0) {
        // No se encontró el registro para eliminar
        setError('Código no encontrado');
      } else {
        // La eliminación fue exitosa
        fetchCourses();
      }
    } catch (error) {
     
    }
  };
  

  const handleStatusChange = async (id, newState) => {
    try {
      const { data, error } = await supabase
        .from('EstadoCurso')
        .update({ Estado: newState })
        .eq('ID_Curso', id);

      if (error) throw error;
      fetchCourses();
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Error updating status');
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <Box sx={{ p: 2 }}>
      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>ID Curso</StyledTableCell>
              <StyledTableCell align="right">Carnet Estudiante</StyledTableCell>
              <StyledTableCell align="right">Estado</StyledTableCell>
              <StyledTableCell align="right">Acciones</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <StyledTableRow key={course.ID_Curso}>
                <StyledTableCell component="th" scope="row">
                  {course.ID_Curso}
                </StyledTableCell>
                <StyledTableCell align="right">{course.Carnet_Estudiante}</StyledTableCell>
                <StyledTableCell align="right">
                  <Select
                    value={course.Estado}
                    onChange={(e) => handleStatusChange(course.ID_Curso, e.target.value)}
                    fullWidth
                  >
                    <MenuItem value="Aprobado">Aprobado</MenuItem>
                    <MenuItem value="Reprobado">Reprobado</MenuItem>
                  </Select>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteStatus(course.ID_Curso)}
                  >
                    Eliminar
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2 }}>
        <TextField
          label="ID Curso"
          variant="outlined"
          value={newStatus.ID_Curso}
          onChange={(e) => setNewStatus({ ...newStatus, ID_Curso: e.target.value })}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Carnet Estudiante"
          variant="outlined"
          value={newStatus.Carnet_Estudiante}
          onChange={(e) => setNewStatus({ ...newStatus, Carnet_Estudiante: e.target.value })}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Select
          value={newStatus.Estado}
          onChange={(e) => setNewStatus({ ...newStatus, Estado: e.target.value })}
          fullWidth
          sx={{ mb: 2 }}
        >
          <MenuItem value="Aprobado">Aprobado</MenuItem>
          <MenuItem value="Reprobado">Reprobado</MenuItem>
        </Select>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddStatus}
        >
          Agregar Estado
        </Button>
      </Box>
    </Box>
  );
};

export default CourseStatus;
