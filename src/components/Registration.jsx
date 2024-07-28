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

  const fetchCourses = async () => {
    setLoading(true);
    const userId = localStorage.getItem('userId');

    if (!userId) {
      setError('Error: No se encontró el ID del usuario.');
      setLoading(false);
      return;
    }

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
  
    // Verifica que hay cursos seleccionados
    if (selectedCourses.length === 0) {
      alert('Por favor, selecciona al menos un curso para matricular.');
      return;
    }
  
    // Construir el array de matrículas
    const matriculas = selectedCourses.map(course => ({
      estudiante_id: userId,
      curso_id: course.curso_id,
    }));
  
    // Insertar matrículas en Supabase
    const { data, error } = await supabase
      .from('Matrículas')
      .insert(matriculas);
  
    // Manejo de errores detallado
    if (error) {
      console.error('Error creating matrícula:', error);
      alert(`Error al crear la matrícula: ${error.message}`);
    } else {
      alert('Matrícula creada con éxito.');
      fetchCourses(); // Refrescar la lista de cursos
      setOpen(false); // Cerrar el diálogo
      setSelectedCourses([]); // Limpiar selección
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

  const totalPrice = selectedCourses.reduce((sum, course) => sum + course.precio, 0);

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
            <StyledTableCell align="right">Seleccionar</StyledTableCell>
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
                <Checkbox
                  checked={selectedCourses.some(selected => selected.curso_id === course.curso_id)}
                  onChange={() => handleCheckboxChange(course)}
                />
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Total a Pagar: {totalPrice}</Typography>
        <Button
          color="success"
          startIcon={<CheckIcon />}
          onClick={handleRegisterClick}
          disabled={selectedCourses.length === 0}
        >
          Confirmar Matrícula
        </Button>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Seleccionar Método de Pago</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Por favor seleccione su método de pago y complete la información requerida.
          </DialogContentText>
          <ButtonGroup variant="contained" fullWidth sx={{ mt: 2 }}>
            <Button onClick={() => handlePaymentMethodChange('tarjeta')}>Tarjeta</Button>
            <Button onClick={() => handlePaymentMethodChange('transferencia')}>Transferencia</Button>
          </ButtonGroup>

          {paymentMethod === 'tarjeta' && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Pago con Tarjeta
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nombre del Encargado"
                    variant="outlined"
                    name="encargado"
                    value={cardDetails.encargado}
                    onChange={handleCardDetailsChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Número de Tarjeta"
                    variant="outlined"
                    name="numeroTarjeta"
                    value={cardDetails.numeroTarjeta}
                    onChange={handleCardDetailsChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Fecha de Vencimiento"
                    variant="outlined"
                    name="vencimiento"
                    value={cardDetails.vencimiento}
                    onChange={handleCardDetailsChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Código de Seguridad (CVV)"
                    variant="outlined"
                    name="cvv"
                    value={cardDetails.cvv}
                    onChange={handleCardDetailsChange}
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {paymentMethod === 'transferencia' && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Pago por Transferencia
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Cédula"
                    variant="outlined"
                    name="cedula"
                    value={transferDetails.cedula}
                    onChange={handleTransferDetailsChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Número de Cuenta IBAN"
                    variant="outlined"
                    name="iban"
                    value={transferDetails.iban}
                    onChange={handleTransferDetailsChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Monto a Pagar"
                    variant="outlined"
                    name="monto"
                    value={transferDetails.monto}
                    onChange={handleTransferDetailsChange}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleRegister}
            color="success"
            disabled={
              !paymentMethod ||
              (paymentMethod === 'tarjeta' && !isCardDetailsValid()) ||
              (paymentMethod === 'transferencia' && !isTransferDetailsValid())
            }
          >
            Confirmar Matrícula
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default Registration;
