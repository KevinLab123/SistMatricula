import React, { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
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

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [newStudent, setNewStudent] = useState({
    Carnet: "",
    Nombre: "",
    Apellido: "",
    Correo_Institucional: "",
    Correo: "",
    Telefono: "",
    Contraseña: "",
  });
  const [deleteStudentCode, setDeleteStudentCode] = useState("");

  // Función para generar un carnet único
  const generateUniqueCarnet = async () => {
    let unique = false;
    let carnet = "";
    while (!unique) {
      const randomDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      carnet = "2024731" + randomDigits;
      const { data, error } = await supabase
        .from("Estudiantes")
        .select("Carnet")
        .eq("Carnet", carnet);
      
      if (error) {
        console.error("Error checking carnet uniqueness:", error);
      } else if (data.length === 0) {
        unique = true;
      }
    }
    return carnet;
  };

  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("Estudiantes")
      .select("Carnet, Nombre, Apellido, Correo_Institucional, Correo, Telefono");
    if (error) {
      setError(error.message);
      console.error("Error fetching students:", error);
    } else {
      setStudents(data);
    }
    setLoading(false);
  };

  const handleAddStudent = async () => {
    // Generar carnet si no está presente
    if (!newStudent.Carnet) {
      const carnet = await generateUniqueCarnet();
      setNewStudent({ ...newStudent, Carnet: carnet });
    }

    // Confirmar antes de agregar
    setOpen(true);
  };

  const confirmAddStudent = async () => {
    // Insertar datos en la base de datos
    const { data: studentData, error: studentError } = await supabase
      .from("Estudiantes")
      .insert([
        {
          Carnet: newStudent.Carnet,
          Nombre: newStudent.Nombre,
          Apellido: newStudent.Apellido,
          Correo_Institucional: newStudent.Correo_Institucional,
          Correo: newStudent.Correo,
          Telefono: newStudent.Telefono,
        },
      ]);

    const { data: profileData, error: profileError } = await supabase
      .from("Perfiles")
      .insert([
        {
          id: newStudent.Carnet,
          Usuario: `${newStudent.Nombre} ${newStudent.Apellido}`,
          Email: newStudent.Correo,
          Contraseña: newStudent.Contraseña,
          rol: "Estudiante",
        },
      ]);

    if (studentError || profileError) {
      setError(studentError ? studentError.message : profileError.message);
      console.error(
        "Error adding student or profile:",
        studentError || profileError
      );
    } else {
      setStudents([
        ...students,
        {
          Carnet: newStudent.Carnet,
          Nombre: newStudent.Nombre,
          Apellido: newStudent.Apellido,
          Correo_Institucional: newStudent.Correo_Institucional,
          Correo: newStudent.Correo,
          Telefono: newStudent.Telefono,
        },
      ]);
      setOpen(false);
      setNewStudent({
        Carnet: "",
        Nombre: "",
        Apellido: "",
        Correo_Institucional: "",
        Correo: "",
        Telefono: "",
        Contraseña: "",
      });
    }
  };

  const confirmDeleteStudent = () => {
    setConfirmDelete(true);
  };

  const handleDeleteStudent = async () => {
    const { data: studentData, error: studentError } = await supabase
      .from("Estudiantes")
      .delete()
      .eq("Carnet", deleteStudentCode);

    const { data: profileData, error: profileError } = await supabase
      .from("Perfiles")
      .delete()
      .eq("id", deleteStudentCode);

    if (studentError || profileError) {
      setError(studentError ? studentError.message : profileError.message);
      console.error(
        "Error deleting student or profile:",
        studentError || profileError
      );
    } else {
      setStudents(
        students.filter((student) => student.Carnet !== deleteStudentCode)
      );
      setDeleteStudentCode("");
      setConfirmDelete(false);
    }
  };

  const handleConfirmDelete = () => {
    handleDeleteStudent();
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Carnet</StyledTableCell>
            <StyledTableCell align="right">Nombre</StyledTableCell>
            <StyledTableCell align="right">Apellido</StyledTableCell>
            <StyledTableCell align="right">Telefono</StyledTableCell>
            <StyledTableCell align="right">Correo Institucional</StyledTableCell>
            <StyledTableCell align="right">
              Correo
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((student, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell component="th" scope="row">
                {student.Carnet}
              </StyledTableCell>
              <StyledTableCell align="right">{student.Nombre}</StyledTableCell>
              <StyledTableCell align="right">
                {student.Apellido}
              </StyledTableCell>
              <StyledTableCell align="right">
                {student.Telefono}
              </StyledTableCell>
              <StyledTableCell align="right">{student.Correo}</StyledTableCell>
              <StyledTableCell align="right">
                {student.Correo_Institucional}
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
          onClick={handleAddStudent}
        >
          Agregar
        </Button>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirmar Agregar Estudiante</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Carnet"
            fullWidth
            value={newStudent.Carnet}
            InputProps={{ readOnly: true }}
          />
          <TextField
            margin="dense"
            label="Nombre"
            fullWidth
            value={newStudent.Nombre}
            onChange={(e) =>
              setNewStudent({ ...newStudent, Nombre: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Apellido"
            fullWidth
            value={newStudent.Apellido}
            onChange={(e) =>
              setNewStudent({ ...newStudent, Apellido: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Telefono"
            fullWidth
            value={newStudent.Telefono}
            onChange={(e) =>
              setNewStudent({ ...newStudent, Telefono: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Correo Institucional"
            fullWidth
            value={newStudent.Correo}
            onChange={(e) =>
              setNewStudent({ ...newStudent, Correo: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Correo"
            fullWidth
            value={newStudent.Correo_Institucional}
            onChange={(e) =>
              setNewStudent({
                ...newStudent,
                Correo_Institucional: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Contraseña"
            type="password"
            fullWidth
            value={newStudent.Contraseña}
            onChange={(e) =>
              setNewStudent({ ...newStudent, Contraseña: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={confirmAddStudent}>Confirmar</Button>
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
          label="Carnet del Estudiante a Eliminar"
          value={deleteStudentCode}
          onChange={(e) => setDeleteStudentCode(e.target.value)}
        />
        <Button variant="outlined" color="error" onClick={confirmDeleteStudent}>
          Eliminar
        </Button>
      </Box>

      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <p>
            ¿Está seguro de que desea eliminar al estudiante con carnet{" "}
            {deleteStudentCode}?
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default Students;
