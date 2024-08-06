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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import { supabase } from '../supabase/client';
import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';

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
    }

    setLoading(false);
  };

  const handleCheckboxChange = (course) => {
    const isSelected = selectedCourses.some(selected => selected.curso_id === course.curso_id);
    let newSelectedCourses;
    if (isSelected) {
      newSelectedCourses = selectedCourses.filter(selected => selected.curso_id !== course.curso_id);
    } else {
      newSelectedCourses = [...selectedCourses, course];
    }
    setSelectedCourses(newSelectedCourses);
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

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    const checkRequirements = async () => {
      let allRequirementsMet = true;
      let requirementErrors = [];

      for (const course of selectedCourses) {
        const { data: reqData, error: reqError } = await supabase
          .from('Requisitos')
          .select('Estado')
          .eq('Carnet_Estudiante', localStorage.getItem('userId'))
          .eq('ID_Curso', course.curso_id) // Actualizado
          .single();

        if (reqError) {
          console.error('Error checking course requirements:', reqError);
          // Añadir error a la lista de errores sin detener el proceso
          requirementErrors.push(`Error al verificar requisitos para el curso ${course.nombre_curso} (${course.curso_id})`);
          continue; // Continuar con el siguiente curso
        }

        if (reqData && reqData.Estado !== 'Cumple') {
          allRequirementsMet = false;
          requirementErrors.push(`Incumplimiento de requisitos: Curso ${course.nombre_curso} (${course.curso_id})`);
          break;
        }
      }

      if (allRequirementsMet) {
        setRequirementsError(null);
      } else {
        setRequirementsError(<Alert severity="warning">{requirementErrors.join(', ')}</Alert>);
      }

      setRequirementsMet(allRequirementsMet);
    };

    if (selectedCourses.length > 0) {
      checkRequirements();
    } else {
      setRequirementsError(null);
      setRequirementsMet(true);
    }
  }, [selectedCourses]);

  return (
    <TableContainer component={Paper}>
      {loading ? <Typography>Loading...</Typography> : error ? <Alert severity="error">{error}</Alert> : (
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Grupo</StyledTableCell>
              <StyledTableCell>Curso</StyledTableCell>
              <StyledTableCell align="right">ID Curso</StyledTableCell>
              <StyledTableCell align="right">Aula</StyledTableCell>
              <StyledTableCell align="right">Horario</StyledTableCell>
              <StyledTableCell align="right">Precio</StyledTableCell>
              <StyledTableCell align="right">Seleccionar</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <StyledTableRow key={course.curso_id}>
                <StyledTableCell>{course.grupo_id}</StyledTableCell>
                <StyledTableCell>{course.nombre_curso}</StyledTableCell>
                <StyledTableCell align="right">{course.curso_id}</StyledTableCell>
                <StyledTableCell align="right">{course.aula}</StyledTableCell>
                <StyledTableCell align="right">{course.horario}</StyledTableCell>
                <StyledTableCell align="right">${course.precio}</StyledTableCell>
                <StyledTableCell align="right">
                  <Checkbox
                    checked={selectedCourses.some((selected) => selected.curso_id === course.curso_id)}
                    onChange={() => handleCheckboxChange(course)}
                  />
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Total a pagar: ${selectedCourses.reduce((total, course) => total + course.precio, 0)}</Typography>
        <Button variant="contained" color="primary" onClick={handleRegisterClick}>
          Confirmar Matrícula
        </Button>
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirmar Matrícula</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Deseas confirmar la matrícula de los cursos seleccionados?
          </DialogContentText>
          {requirementsError && (
            <Box sx={{ mb: 2 }}>{requirementsError}</Box>
          )}
          <Box>
            <Typography variant="h6">Método de Pago</Typography>
            <ButtonGroup variant="contained" color="primary">
              <Button
                onClick={() => handlePaymentMethodChange('card')}
                disabled={!requirementsMet}
              >
                Tarjeta
              </Button>
              <Button
                onClick={() => handlePaymentMethodChange('transfer')}
                disabled={!requirementsMet}
              >
                Transferencia
              </Button>
            </ButtonGroup>
            {paymentMethod === 'card' && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  name="encargado"
                  label="Nombre del Encargado"
                  value={cardDetails.encargado}
                  onChange={handleCardDetailsChange}
                  fullWidth
                />
                <TextField
                  name="numeroTarjeta"
                  label="Número de Tarjeta"
                  value={cardDetails.numeroTarjeta}
                  onChange={handleCardDetailsChange}
                  fullWidth
                  type="number"
                />
                <TextField
                  name="vencimiento"
                  label="Fecha de Vencimiento"
                  value={cardDetails.vencimiento}
                  onChange={handleCardDetailsChange}
                  fullWidth
                />
                <TextField
                  name="cvv"
                  label="CVV"
                  value={cardDetails.cvv}
                  onChange={handleCardDetailsChange}
                  fullWidth
                  type="number"
                />
              </Box>
            )}
            {paymentMethod === 'transfer' && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  name="cedula"
                  label="Cédula"
                  value={transferDetails.cedula}
                  onChange={handleTransferDetailsChange}
                  fullWidth
                />
                <TextField
                  name="iban"
                  label="IBAN"
                  value={transferDetails.iban}
                  onChange={handleTransferDetailsChange}
                  fullWidth
                />
                <TextField
                  name="monto"
                  label="Monto"
                  value={transferDetails.monto}
                  onChange={handleTransferDetailsChange}
                  fullWidth
                  type="number"
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleRegister}
            disabled={!requirementsMet || (paymentMethod === 'card' ? !isCardDetailsValid() : !isTransferDetailsValid())}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default Registration;
