<template>
  <div class="container mt-5" v-if="usuario">
    <div class="profile-card">
      <div
        class="profile-header"
        style="display: flex; align-items: center; padding: 10px"
      >
        <button
          class="btn btn-secondary"
          style="margin-left: auto; margin-bottom: auto"
          @click="mostrarDetalles"
        >
          Detalles
        </button>
      </div>

      <div class="profile-content">
        <img
          :src="usuario.imagen"
          alt="Foto de perfil"
          @click="triggerFileInput"
          class="profile-image"
        />
        <input
          type="file"
          ref="fileInput"
          accept="image/*"
          style="display: none"
          @change="handleFileChange"
        />
        <div class="profile-info">
          <h3>{{ usuario.nombre }} {{ usuario.apellidos }}</h3>
          <p>{{ usuario.curso }}</p>
        </div>
        <div class="profile-buttons text-end">
          <button class="btn btn-secondary">
            {{ usuario.idRole === 2 ? "Alumno" : "Profesor" }}
          </button>
          <button class="btn btn-secondary">
            {{ usuario.estadoUsuario ? "Activo" : "Inactivo" }}
          </button>
        </div>
      </div>
      <hr />

      <!-- <div class="row">
        <div class="col-md-4">
          <div class="course-card">
            <div
              class="card-header d-flex justify-content-between align-items-center"
            >
              <button class="btn btn-success status">Activo</button>
            </div>
            <div class="card-body">
              <h5>Curso 2024-2025</h5>
              <p>Descripción</p>
            </div>
            <button class="add-button">+</button>
          </div>
        </div>
        <div class="col-md-4">
          <div class="course-card">
            <div
              class="card-header d-flex justify-content-between align-items-center"
            >
              <button class="btn btn-danger status">Inactivo</button>
            </div>
            <div class="card-body">
              <h5>Curso 2023-2024</h5>
              <p>Descripción</p>
            </div>
            <button class="add-button">+</button>
          </div>
        </div>
        <div class="col-md-4">
          <div class="course-card">
            <div
              class="card-header d-flex justify-content-between align-items-center"
            >
              <button class="btn btn-danger status">Inactivo</button>
            </div>
            <div class="card-body">
              <h5>Curso 2022-2023</h5>
              <p>Descripción</p>
            </div>
            <button class="add-button">+</button>
          </div>
        </div>
      </div> -->

      <div v-if="cargando" class="text-center mb-4">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Cargando cursos...</span>
        </div>
      </div>

      <div class="row" v-if="!cargando">
        <div class="col-md-4" v-for="(cursoData, index) in cursos" :key="index">
          <div class="course-card">
            <div
              class="card-header d-flex justify-content-between align-items-center"
            >
              <button style="margin-left: auto"
                class="btn"
                :class="cursoData.curso.activo ? 'btn-success' : 'btn-danger'"
              >
                {{ cursoData.curso.activo ? "Activo" : "Inactivo" }}
              </button>
            </div>
            <div class="card-body">
              <h5>{{ cursoData.curso.nombre }}</h5>
              <p>Alumnos: {{ cursoData.numeroAlumnos }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Detalles del usuario -->
      <div v-if="showDetails">
        <div class="list-group">
          <div class="list-group-item">
            <strong>Nombre:</strong> {{ usuario.nombre }}
          </div>
          <div class="list-group-item">
            <strong>Apellidos:</strong> {{ usuario.apellidos }}
          </div>
          <div class="list-group-item">
            <strong>Email:</strong> {{ usuario.email }}
          </div>
          <div class="list-group-item">
            <strong>Curso:</strong> {{ usuario.curso }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import PerfilService from "@/services/PerfilService";
import Swal from "sweetalert2";

export default {
  name: "PerfilProfesorComponent",
  data() {
    return {
      usuario: null,
      rondas: [],
      alumnos: [],
      cursos: [],
      seccionActiva: null, // 'rondas' o 'alumnos'
      perfilService: new PerfilService(),
      cargando: false,
    };
  },
  methods: {
    mostrarDetalles() {
      Swal.fire({
        title: "Detalles del Usuario", // Título del SweetAlert
        html: `
          <strong>Nombre:</strong> ${this.usuario.nombre} <br>
          <strong>Apellidos:</strong> ${this.usuario.apellidos} <br>
          <strong>Email:</strong> ${this.usuario.email} <br>
          <strong>Curso Actual:</strong> ${this.usuario.curso} <br>
        `,
        icon: "info", // Tipo de ícono (puedes cambiarlo por otro si lo deseas)
        confirmButtonText: "Cerrar", // Botón para cerrar el alert
      });
    },
    async cargarPerfil() {
      try {
        const data = await this.perfilService.getUsuarioPerfil();
        this.usuario = data.usuario; // Guardamos los datos del usuario en el estado
        this.editedUsuario = { ...this.usuario }; // Inicializamos editedUsuario
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
        alert("No se pudo cargar la información del perfil.");
      }
    },
    cancelarEdicion() {
      this.editMode = false; // Cancelar edición
      this.editedUsuario = { ...this.usuario }; // Revertir cambios no guardados
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    async handleFileChange(event) {
      const file = event.target.files[0];
      if (!file) return; // Si no se seleccionó archivo, salir
      try {
        const base64Content = await this.convertFileToBase64(file);
        await this.perfilService.uploadUserImage(
          this.usuario.idUsuario,
          file.name,
          base64Content
        );
        this.usuario.imagen = URL.createObjectURL(file); // Actualiza la imagen mostrada
      } catch (error) {
        console.error("Error al subir la imagen:", error);
        alert("No se pudo subir la imagen. Inténtalo de nuevo.");
      }
    },
    convertFileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]); // Solo el contenido base64
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    },
    async mostrarRondas() {
      try {
        this.seccionActiva = "rondas";
        this.cargando = true;
        const data = await this.perfilService.getRondasProfesor();
        this.rondas = data;
      } catch (error) {
        console.error("Error al cargar las rondas:", error);
        alert("No se pudieron cargar las rondas.");
      } finally {
        this.cargando = false; // Ocultar spinner
      }
    },
    async cargarCursos() {
      try {
        this.cargando = true;
        const data = await this.perfilService.getAlumnosCursoProfesor();
        console.log(data);
        // Asegúrate de que los cursos se asignan correctamente
        this.cursos = data.map((cursoData) => ({
          curso: cursoData.curso,
          numeroAlumnos: cursoData.numeroAlumnos,
        }));
      } catch (error) {
        console.error("Error al cargar los cursos:", error);
        alert("No se pudieron cargar los cursos.");
      } finally {
        this.cargando = false; // Desactiva el spinner
      }
    },
    async mostrarAlumnos() {
      try {
        this.seccionActiva = "alumnos";
        this.cargando = true;
        const data = await this.perfilService.getAlumnosCursoProfesor();
        // Si 'data' es un array de cursos con sus alumnos
        // Filtrar solo alumnos con estadoUsuario activo
        this.alumnos =
          data.length > 0
            ? data[0].alumnos.filter(
                (alumno) => alumno.alumno.estadoUsuario == true
              )
            : [];
      } catch (error) {
        console.error("Error al cargar los alumnos:", error);
        alert("No se pudieron cargar los alumnos.");
      } finally {
        this.cargando = false; // Ocultar spinner
      }
    },
    abrirAlerta(alumno) {
      if (alumno.estadoUsuario == true) {
        Swal.fire({
          title: "¿Estás seguro?",
          text: `Estás a punto de desactivar al usuario "${alumno.usuario}"`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, cambiar",
          cancelButtonText: "Cancelar",
        }).then((result) => {
          if (result.isConfirmed) {
            this.cambiarEstadoAlumno(alumno);
          }
        });
      }
    },
    async cambiarEstadoAlumno(alumno) {
      if (alumno.estadoUsuario == true) {
        try {
          // Realizar la eliminación en el servidor
          await this.perfilService.updateEstadoUsuario(
            alumno.idUsuario,
            !alumno.estadoUsuario
          );
          Swal.fire(
            "Estado cambiado",
            `El usuario "${alumno.usuario}" ha sido desactivado correctamente. Ahora no podrá acceder al sistema.`,
            "success"
          );
          await this.mostrarAlumnos();
        } catch (error) {
          console.error("Error al eliminar el alumno:", error);
          Swal.fire(
            "Error en la Operación",
            "No se pudo desactivar al usuario. Por favor, inténtalo más tarde.",
            "error"
          );
        }
      }
    },
  },
  created() {
    this.cargarPerfil();
    this.cargarCursos();
  },
};
</script>

<style scoped>
.profile-image {
  border: 4px solid #007bff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card {
  background-color: #f8f9fa;
}

.card h4 {
  color: #333;
}

.list-group-item {
  font-size: 1.1em;
  padding: 15px;
  border: 1px solid #ddd;
  background-color: #ffffff;
  margin-bottom: 10px;
}

.list-group-item strong {
  color: #007bff;
}

@media (min-width: 768px) {
  .card {
    padding: 30px;
  }

  .profile-image {
    width: 150px;
    height: 150px;
  }
}

@media (min-width: 1200px) {
  .container {
    max-width: 1200px;
  }
  .card {
    padding: 40px;
  }
  .profile-image {
    width: 180px;
    height: 180px;
  }
}

body {
  background-color: #f5f5f5;
}

.profile-card {
  background-color: #e0e0e0;
  border-radius: 10px;
  padding: 20px;
}

.profile-header {
  background-color: #a0a0a0;
  height: 150px;
  border-radius: 10px 10px 0 0;
}

.profile-content {
  display: flex;
  margin-top: -80px;
  gap: 20px;
}

.profile-image {
  width: 240px;
  height: 240px;
  border-radius: 30px;
  object-fit: cover;
  margin-left: 20px;
  margin-bottom: 30px;
}

.profile-info {
  display: block;
  flex-grow: 1;
  margin-top: auto;
  padding-bottom: 80px;
}

.profile-info h3 {
  margin: 0;
}

.profile-buttons {
  margin-top: 20px;
  margin-top: auto;
  padding-bottom: 0px;
}

.profile-buttons button {
  margin-right: 20px;
}

.course-card {
  background-color: #d6d6d6;
  border-radius: 10px;
  position: relative;
}

.course-card .card-header {
  background-color: #a0a0a0;
  padding: 20px;
  border-radius: 10px 10px 0 0;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.course-card .status {
  font-size: 12px;
  padding: 5px 10px;
  margin-left: auto;
}

.course-card .card-body {
  padding: 15px;
}

.course-card .add-button {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 25px;
  height: 25px;
  background-color: #fff;
  border: none;
  border-radius: 50%;
  font-weight: bold;
  line-height: 1;
  text-align: center;
  cursor: pointer;
}
</style>
