  import React, { useEffect, useState } from "react";
  import { supabase } from "../supabase/client"; // Asegúrate de que la ruta sea correcta
  import { styled } from "@mui/material/styles";
  import Table from "@mui/material/Table";
  import TableBody from "@mui/material/TableBody";
  import TableCell, { tableCellClasses } from "@mui/material/TableCell";
  import TableContainer from "@mui/material/TableContainer";
  import TableHead from "@mui/material/TableHead";
  import TableRow from "@mui/material/TableRow";
  import Paper from "@mui/material/Paper";
  import {
    Button,
    Box,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Alert,
  } from "@mui/material";

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
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  const StudyAdm = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [newCourse, setNewCourse] = useState({
      Codigo: "",
      Nombre: "",
      Descripción: "",
      Créditos: "",
      Nombre_Carrera: "Ingenieria en Sistemas",
    });
    const [deleteCourseCode, setDeleteCourseCode] = useState("");

    const fetchCourses = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("Cursos")
          .select("Codigo, Nombre, Descripción, Créditos, Nombre_Carrera");

        if (error) throw error;

        setCourses(data);
      } catch (err) {
        setError("Error detectado");
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    const handleAddCourse = async () => {
      const cleanedCourse = {
        ...newCourse,
        Codigo: newCourse.Codigo.trim(),
        Nombre: newCourse.Nombre.trim(),
        Descripción: newCourse.Descripción.trim(),
        Créditos: newCourse.Créditos.trim(),
      };

      try {
        const { data, error } = await supabase
          .from("Cursos")
          .insert([cleanedCourse]);

        if (error) throw error;

        setCourses([...courses, cleanedCourse]);
        setNewCourse({
          Codigo: "",
          Nombre: "",
          Descripción: "",
          Créditos: "",
          Nombre_Carrera: "Ingenieria en Sistemas",
        });
        setOpen(false);
      } catch (err) {
        setError("Error detectado");
        console.error("Error adding course:", err);
      }
    };

    const confirmDeleteCourse = () => {
      setConfirmDelete(true);
    };

    const handleDeleteCourse = async () => {
      try {
        const { data, error } = await supabase
          .from("Cursos")
          .delete()
          .eq("Codigo", deleteCourseCode);

        if (error) throw error;

        setCourses(
          courses.filter((course) => course.Codigo !== deleteCourseCode)
        );
        setDeleteCourseCode("");
        setConfirmDelete(false);
      } catch (err) {
        setError("Error detectado");
        console.error("Error deleting course:", err);
      }
    };

    const handleConfirmDelete = () => {
      handleDeleteCourse();
    };

    useEffect(() => {
      fetchCourses();
    }, []);

    return (
      <TableContainer component={Paper}>
        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ margin: 2 }}>
            {error}
          </Alert>
        )}

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
                <StyledTableCell align="right">
                  {course.Descripción}
                </StyledTableCell>
                <StyledTableCell align="right">{course.Créditos}</StyledTableCell>
                <StyledTableCell align="right">
                  {course.Nombre_Carrera}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>

        <Box
          display="flex"
          justifyContent="center"
          gap={2}
          marginTop={2}
          padding={2}
        >
          <Button
            variant="contained"
            color="success"
            onClick={() => setOpen(true)}
          >
            Agregar
          </Button>
        </Box>

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Agregar Curso</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Codigo"
              fullWidth
              value={newCourse.Codigo}
              onChange={(e) =>
                setNewCourse({ ...newCourse, Codigo: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Nombre"
              fullWidth
              value={newCourse.Nombre}
              onChange={(e) =>
                setNewCourse({ ...newCourse, Nombre: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Descripción"
              fullWidth
              value={newCourse.Descripción}
              onChange={(e) =>
                setNewCourse({ ...newCourse, Descripción: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Créditos"
              fullWidth
              value={newCourse.Créditos}
              onChange={(e) =>
                setNewCourse({ ...newCourse, Créditos: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Carrera"
              fullWidth
              value={newCourse.Nombre_Carrera}
              InputProps={{
                readOnly: true,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleAddCourse} color="primary">
              Agregar
            </Button>
          </DialogActions>
        </Dialog>

        <Box
          display="flex"
          justifyContent="center"
          gap={2}
          marginTop={2}
          padding={2}
        >
          <TextField
            label="Codigo del Curso a Eliminar"
            value={deleteCourseCode}
            onChange={(e) => setDeleteCourseCode(e.target.value)}
          />
          <Button variant="outlined" color="error" onClick={confirmDeleteCourse}>
            Eliminar
          </Button>
        </Box>

        <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
          <DialogTitle>Confirmar Eliminación</DialogTitle>
          <DialogContent>
            <p>
              ¿Estás seguro de que deseas eliminar el curso con código{" "}
              {deleteCourseCode}?
            </p>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDelete(false)} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleConfirmDelete} color="primary">
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>
      </TableContainer>
    );
  };

  export default StudyAdm;
