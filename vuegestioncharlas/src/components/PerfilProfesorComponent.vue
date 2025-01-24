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
        <img :src="usuario.imagen" alt="Foto de perfil" class="profile-image" />
        <i class="fa fa-pencil edit-icon" @click="triggerFileInput"></i>
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

      <div v-if="cargando" class="text-center mb-4">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Cargando cursos...</span>
        </div>
      </div>

      <div
        class="row row-cols-xl-3 row-cols-lg-2 row-cols-1 d-flex"
        v-if="!cargando"
      >
        <div
          class="col-12 col-sm-6 col-md-4"
          style="margin-bottom: 20px"
          v-for="(cursoData, index) in cursos"
          :key="index"
        >
          <div class="course-card">
            <div
              class="card-header d-flex justify-content-between align-items-center"
            >
              <button
                style="margin-left: auto"
                class="btn"
                :class="cursoData.curso.activo ? 'btn-success' : 'btn-danger'"
              >
                {{ cursoData.curso.activo ? "Activo" : "Inactivo" }}
              </button>
            </div>
            <div class="card-body">
              <h5>{{ cursoData.curso.nombre }}</h5>
              <p>Alumnos: {{ cursoData.numeroAlumnos }}</p>
              <button
                class="btn btn-primary mt-3"
                @click="
                  verAlumnos(cursoData.curso.idCurso, cursoData.curso.activo)
                "
              >
                Ver Alumnos
              </button>
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
  <router-view />
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
    async verAlumnos(idCurso, activo) {
      try {
        this.cargando = true; // Mostrar spinner
        let data;
        if (!activo) {
          data = await this.perfilService.getAlumnosCursoActivoProfesor(
            idCurso
          );
        } else {
          const cursosData = await this.perfilService.getAlumnosCursoProfesor();
          data = cursosData.find((curso) => curso.curso.idCurso === idCurso);
        }

        if (data && data.alumnos) {
          this.alumnos = data.alumnos;
          this.$router.push(`/perfilprofesor/alumnos`); // Redirigir
        } else {
          Swal.fire({
            icon: "warning",
            title: "Sin datos",
            text: "No se encontraron alumnos para el curso seleccionado.",
          });
        }
      } catch (error) {
        console.error("Error al cargar los alumnos:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al cargar los datos. Inténtalo de nuevo.",
        });
      } finally {
        this.cargando = false; // Ocultar spinner
      }
    },
    mostrarDetalles() {
      Swal.fire({
        title: "Detalles del Usuario", // Título del SweetAlert
        html: `
        <div style="text-align: left;">
          <strong>Nombre:</strong> ${this.usuario.nombre} <br>
          <strong>Apellidos:</strong> ${this.usuario.apellidos} <br>
          <strong>Email:</strong> ${this.usuario.email} <br>
          <strong>Curso Actual:</strong> ${this.usuario.curso} <br>
          </div>
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
.image-container {
  position: relative;
  display: inline-block;
}
.profile-image {
  border: 4px solid #007bff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.edit-icon {
  height: 10%;
  position: relative;
  top: 0px; /* Ajusta según el espacio deseado */
  right: 15px; /* Ajusta según el espacio deseado */
  font-size: 20px; /* Tamaño del ícono */
  color: white;
  background-color: rgba(0, 0, 0, 0.5); /* Fondo oscuro translúcido */
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10; /* Asegura que esté encima de la imagen */
}

.edit-icon:hover {
  background-color: rgba(0, 0, 0, 0.8);
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

.row {
  display: flex;
  margin-left: 0;
  margin-right: 0;
}

.course-card {
  background-color: #d6d6d6;
  border-radius: 10px;
  position: relative;
  height: 100%;
  width: 100%;
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
@media (max-width: 991px) {
  .d-flex {
    justify-content: center !important;
  }

  .col-12 {
    width: 80% !important; /* Asegura que las columnas ocupen todo el ancho */
  }

  .profile-content {
    flex-wrap: wrap; /* Permite que los elementos se muevan a la siguiente línea */
  }

  .profile-info {
    flex: 1; /* Ocupa el espacio disponible al lado de la imagen */
    text-align: left; /* Mantiene el texto alineado a la izquierda */
    margin-bottom: 0; /* Evita márgenes innecesarios */
  }

  .profile-info h3 {
    margin-bottom: 5px; /* Reduce espacio entre el nombre y apellidos */
  }

  .profile-buttons {
    width: 75%; /* El bloque de botones ocupará todo el ancho */
    margin-top: 20px; /* Añade espacio entre los botones y los otros elementos */
    display: flex;
    align-items: center; /* Centra los botones horizontalmente */
    margin-left: auto;
    margin-right: auto;
    gap: 15px;
  }

  .profile-buttons button {
    flex: 1 1 auto;
    margin: 0 auto;
    white-space: nowrap;
  }

  @media (max-width: 767px) {
    .profile-info {
      text-align: center; /* Centra los elementos en el eje horizontal */
      padding-bottom: 0px;
      flex: auto;
    }
  }

  @media (max-width: 400px) {
    .profile-image {
      width: 200px;
      height: 200px;
      border-radius: 30px;
      object-fit: cover;
      margin-left: 20px;
      margin-bottom: 30px;
    }
  }

  @media (max-width: 340px) {
    .profile-image {
      width: 150px;
      height: 150px;
      border-radius: 30px;
      object-fit: cover;
      margin-left: 20px;
      margin-bottom: 30px;
    }
  }
}
</style>
