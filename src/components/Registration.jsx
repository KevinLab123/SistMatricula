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
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ButtonGroup from '@mui/material/ButtonGroup';
import Alert from '@mui/material/Alert';
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
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    encargado: '',
    numeroTarjeta: '',
    vencimiento: '',
    cvv: '',
  });
  const [transferDetails, setTransferDetails] = useState({
    cedula: '',
    iban: '',
    monto: '',
  });
  const [requirementsError, setRequirementsError] = useState(null);
  const [requirementsMet, setRequirementsMet] = useState(true);
  const [scheduleConflict, setScheduleConflict] = useState(false);
  const [selectionWarning, setSelectionWarning] = useState('');

  const fetchCourses = async () => {
    setLoading(true);
    const userId = localStorage.getItem('userId');

    if (!userId) {
      setError('Error: No se encontró el ID del usuario.');
      setLoading(false);
      return;
    }

    // Fetch student id
    const { data: studentData, error: studentError } = await supabase
      .from('Perfiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (studentError) {
      setError(studentError.message);
      console.error('Error fetching student data:', studentError);
      setLoading(false);
      return;
    }

    const studentId = studentData ? studentData.id : '';

    // Fetch enrolled courses
    const { data: enrolledCoursesData, error: enrollmentError } = await supabase
      .from('Matrículas')
      .select('curso_id')
      .eq('estudiante_id', userId);

    if (enrollmentError) {
      setError(enrollmentError.message);
      console.error('Error fetching enrolled courses:', enrollmentError);
      setLoading(false);
      return;
    }

    const enrolledCourseIds = enrolledCoursesData.map((matricula) => matricula.curso_id);

    // Fetch available courses
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
      const availableCourses = coursesWithNames.filter(
        (course) => !enrolledCourseIds.includes(course.curso_id)
      );
      setCourses(availableCourses);

      // Fetch enrolled courses details
      const enrolledCoursesDataWithDetails = coursesWithNames.filter(course => enrolledCourseIds.includes(course.curso_id));
      setEnrolledCourses(enrolledCoursesDataWithDetails);
    }

    setLoading(false);
  };

  const handleCheckboxChange = (course) => {
    const isSelected = selectedCourses.some(selected => selected.curso_id === course.curso_id);

    if (isSelected) {
      // Remove the course from the selection
      setSelectedCourses(selectedCourses.filter(selected => selected.curso_id !== course.curso_id));
      setSelectionWarning('');
    } else {
      // Only add the course if fewer than 5 courses are selected
      if (selectedCourses.length < 5) {
        setSelectedCourses([...selectedCourses, course]);
        setSelectionWarning('');
      } else {
        setSelectionWarning('Puedes seleccionar un máximo de 5 cursos.');
      }
    }
  };

  const handleRegisterClick = () => {
    setOpen(true);
  };

  const handleRegister = async () => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      alert('Error: No se encontró el ID del usuario.');
      return;
    }

    if (selectedCourses.length === 0) {
      alert('Por favor, selecciona al menos un curso para matricular.');
      return;
    }

    const matriculas = selectedCourses.map(course => ({
      estudiante_id: userId,
      curso_id: course.curso_id,
    }));

    const { data, error } = await supabase
      .from('Matrículas')
      .insert(matriculas);

    if (error) {
      console.error('Error creating matrícula:', error);
      alert(`Error al crear la matrícula: ${error.message}`);
    } else {
      alert('Matrícula creada con éxito.');
      fetchCourses();
      setOpen(false);
      setSelectedCourses([]);
    }
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleCardDetailsChange = (event) => {
    setCardDetails({
      ...cardDetails,
      [event.target.name]: event.target.value,
    });
  };

  const handleTransferDetailsChange = (event) => {
    setTransferDetails({
      ...transferDetails,
      [event.target.name]: event.target.value,
    });
  };

  const isCardDetailsValid = () => {
    return (
      cardDetails.encargado &&
      cardDetails.numeroTarjeta &&
      cardDetails.vencimiento &&
      cardDetails.cvv
    );
  };

  const isTransferDetailsValid = () => {
    return transferDetails.cedula && transferDetails.iban && transferDetails.monto;
  };

  const checkScheduleConflicts = () => {
    const selectedSchedules = selectedCourses.map(course => course.horario);
    const enrolledSchedules = enrolledCourses.map(course => course.horario);
  
    // Verificar conflictos entre los cursos seleccionados
    const hasInternalConflict = selectedSchedules.some((item, index) => selectedSchedules.indexOf(item) !== index);
  
    // Verificar conflictos entre los cursos seleccionados y los cursos ya matriculados
    const hasExternalConflict = selectedSchedules.some(schedule => 
      enrolledSchedules.includes(schedule)
    );
  
    setScheduleConflict(hasInternalConflict || hasExternalConflict);
  };
  
  useEffect(() => {
    fetchCourses();
  }, []);
  
  useEffect(() => {
    checkScheduleConflicts();
  }, [selectedCourses, enrolledCourses]);
  
  

  useEffect(() => {
    const checkRequirements = async () => {
      let allRequirementsMet = true;
      let requirementErrors = [];

      for (const course of selectedCourses) {
        const { data: reqData, error: reqError } = await supabase
          .from('Requisitos')
          .select('Estado')
          .eq('Carnet_Estudiante', localStorage.getItem('userId'))
          .eq('ID_Curso', course.curso_id)
          .single();

        if (reqError) {
          console.error('Error checking course requirements:', reqError);
          requirementErrors.push(`Error al verificar requisitos para el curso ${course.nombre_curso} (${course.curso_id})`);
          continue; // Continuar con el siguiente curso
        }

        if (reqData && reqData.Estado !== true) { // Comparar como booleano
          allRequirementsMet = false;
          requirementErrors.push(`Incumplimiento de requisitos: Curso ${course.nombre_curso} (${course.curso_id})`);
          break;
        }
      }

      if (allRequirementsMet) {
        setRequirementsError(null);
      } else {
        setRequirementsError(<Alert severity="error">{requirementErrors.join(' | ')}</Alert>);
      }

      setRequirementsMet(allRequirementsMet);
    };

    if (selectedCourses.length > 0) {
      checkRequirements();
    }
  }, [selectedCourses]);

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Cursos Disponibles
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {loading ? (
        <Typography variant="body1">Cargando cursos...</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Curso</StyledTableCell>
                <StyledTableCell>Grupo</StyledTableCell>
                <StyledTableCell>Aula</StyledTableCell>
                <StyledTableCell>Horario</StyledTableCell>
                <StyledTableCell>Precio</StyledTableCell>
                <StyledTableCell>Seleccionar</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <StyledTableRow key={course.curso_id}>
                  <StyledTableCell>{course.nombre_curso}</StyledTableCell>
                  <StyledTableCell>{course.grupo_id}</StyledTableCell>
                  <StyledTableCell>{course.aula}</StyledTableCell>
                  <StyledTableCell>{course.horario}</StyledTableCell>
                  <StyledTableCell>{course.precio}</StyledTableCell>
                  <StyledTableCell>
                    <Checkbox
                      checked={selectedCourses.some(selected => selected.curso_id === course.curso_id)}
                      onChange={() => handleCheckboxChange(course)}
                    />
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {requirementsError && <Box mb={2}>{requirementsError}</Box>}
      {scheduleConflict && (
        <Alert severity="warning">Conflicto de horarios detectado.</Alert>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handleRegisterClick}
        disabled={!requirementsMet || scheduleConflict}
      >
        Matricular Cursos
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Seleccionar Método de Pago</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Selecciona el método de pago y proporciona los detalles correspondientes.
          </DialogContentText>
          <ButtonGroup variant="contained" color="primary">
            <Button onClick={() => handlePaymentMethodChange('card')}>Tarjeta de Crédito</Button>
            <Button onClick={() => handlePaymentMethodChange('transfer')}>Transferencia Bancaria</Button>
          </ButtonGroup>
          {paymentMethod === 'card' && (
            <Box mt={2}>
              <TextField
                label="Nombre del Encargado"
                name="encargado"
                fullWidth
                onChange={handleCardDetailsChange}
              />
              <TextField
                label="Número de Tarjeta"
                name="numeroTarjeta"
                fullWidth
                onChange={handleCardDetailsChange}
              />
              <TextField
                label="Vencimiento (MM/AA)"
                name="vencimiento"
                fullWidth
                onChange={handleCardDetailsChange}
              />
              <TextField
                label="CVV"
                name="cvv"
                fullWidth
                onChange={handleCardDetailsChange}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleRegister}
                disabled={!isCardDetailsValid()}
              >
                Confirmar Pago con Tarjeta
              </Button>
            </Box>
          )}
          {paymentMethod === 'transfer' && (
            <Box mt={2}>
              <TextField
                label="Cédula"
                name="cedula"
                fullWidth
                onChange={handleTransferDetailsChange}
              />
              <TextField
                label="IBAN"
                name="iban"
                fullWidth
                onChange={handleTransferDetailsChange}
              />
              <TextField
                label="Monto"
                name="monto"
                fullWidth
                onChange={handleTransferDetailsChange}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleRegister}
                disabled={!isTransferDetailsValid()}
              >
                Confirmar Pago por Transferencia
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
      <Typography variant="h5" gutterBottom>
        Cursos Matriculados
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Curso</StyledTableCell>
              <StyledTableCell>Grupo</StyledTableCell>
              <StyledTableCell>Aula</StyledTableCell>
              <StyledTableCell>Horario</StyledTableCell>
              <StyledTableCell>Precio</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {enrolledCourses.map((course) => (
              <StyledTableRow key={course.curso_id}>
                <StyledTableCell>{course.nombre_curso}</StyledTableCell>
                <StyledTableCell>{course.grupo_id}</StyledTableCell>
                <StyledTableCell>{course.aula}</StyledTableCell>
                <StyledTableCell>{course.horario}</StyledTableCell>
                <StyledTableCell>{course.precio}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Registration;
