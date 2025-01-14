<template>
  <div class="container mt-5" v-if="usuario">
    <div
      class="card shadow-lg p-4 rounded mx-auto"
      style="width: 100%; max-width: 1100px"
    >
      <div class="row text-center text-md-start">
        <div class="col-12 col-md-3 mb-4 mb-md-0">
          <img
            :src="usuario.imagen"
            alt="Foto de perfil"
            @click="triggerFileInput"
            class="profile-image img-fluid rounded-circle border-primary mb-3"
            style="width: 150px; height: 150px; object-fit: cover"
          />
          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            style="display: none"
            @change="handleFileChange"
          />
        </div>
        <div class="col-12 col-md-9">
          <h4 class="font-weight-bold">
            {{ usuario.nombre }} {{ usuario.apellidos }}
          </h4>
          <p class="text-muted">
            {{ usuario.idRole === 2 ? "Alumno" : "Profesor" }}
          </p>

          <div v-if="!editMode">
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

      <div class="d-flex gap-3 mt-4 justify-content-center justify-content-md-start">
        <button
          class="btn"
          :class="{ 'btn-primary': seccionActiva === 'rondas', 'btn-outline-primary': seccionActiva !== 'rondas' }"
          @click="mostrarRondas"
        >
          Ver Rondas
        </button>
        <button
          class="btn"
          :class="{ 'btn-secondary': seccionActiva === 'alumnos', 'btn-outline-secondary': seccionActiva !== 'alumnos' }"
          @click="mostrarAlumnos"
        >
          Ver Alumnos
        </button>
      </div>

      <!-- Tabla de Rondas -->
      <div v-if="seccionActiva === 'rondas'" class="mt-4">

        <!-- Mostrar spinner mientras se cargan las rondas -->
        <div v-if="cargando" class="d-flex justify-content-center my-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>

        <!-- Mostrar mensaje si no hay alumnos -->
        <div v-else-if="!rondas.length && !cargando" class="alert alert-warning text-center my-4">
          No hay rondas creadas.
        </div>

        <h5 v-if="!cargando">Rondas</h5>
        <table class="table table-bordered table-hover" v-if="!cargando">
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Duración</th>
              <th>Fecha Cierre</th>
              <th>Fecha Límite Votación</th>
              <th>Fecha Presentación</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ronda in rondas" :key="ronda.idRonda">
              <td>{{ ronda.descripcionModulo }}</td>
              <td>{{ ronda.duracion }} minutos</td>
              <td>{{  new Date(ronda.fechaCierre).toLocaleDateString()  }}</td>
              <td>
                {{ new Date(ronda.fechaPresentacion).toLocaleDateString() }}
              </td>
              <td>
                {{ new Date(ronda.fechaLimiteVotacion).toLocaleDateString() }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Lista de Alumnos -->
      <div v-if="seccionActiva === 'alumnos'" class="mt-4">
        <h5 v-if="!cargando">Alumnos del Curso</h5>

        <!-- Mostrar spinner mientras se cargan los alumnos -->
        <div v-if="cargando" class="d-flex justify-content-center my-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>

        <!-- Mostrar mensaje si no hay alumnos -->
        <div v-else-if="!alumnos.length && !cargando" class="alert alert-warning text-center my-4">
          No hay alumnos en el curso.
        </div>

        <!-- Mostrar lista de alumnos -->
        <ul v-else class="list-group">
          <li
            class="list-group-item"
            v-for="alumno in alumnos"
            :key="alumno.alumno.idUsuario"
          >
            <div class="d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center">
                <img
                  :src="alumno.alumno.imagen"
                  alt="Foto de Alumno"
                  class="rounded-circle border-primary me-3"
                  style="width: 50px; height: 50px; object-fit: cover"
                />
                <div>
                  <strong>{{ alumno.alumno.usuario }}</strong>
                  <p class="text-muted">{{ alumno.alumno.email }}</p>
                </div>
              </div>
              <button
                class="btn btn-danger btn-sm ms-auto"
                @click="abrirAlerta(alumno.alumno)"
              >
                Desactivar
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Cargando perfil...</p>
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
      seccionActiva: null, // 'rondas' o 'alumnos'
      perfilService: new PerfilService(),
      cargando: false,
    };
  },
  methods: {
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
      }
      finally {
        this.cargando = false; // Ocultar spinner
      }
    },
    async mostrarAlumnos() {
      try {
        this.seccionActiva = "alumnos";
        this.cargando = true; 
        const data = await this.perfilService.getAlumnosCursoProfesor();
        // Si 'data' es un array de cursos con sus alumnos
        // Filtrar solo alumnos con estadoUsuario activo
        this.alumnos = data.length > 0 
          ? data[0].alumnos.filter(alumno => alumno.alumno.estadoUsuario == true) 
          : [];
      } catch (error) {
        console.error("Error al cargar los alumnos:", error);
        alert("No se pudieron cargar los alumnos.");
      }
      finally {
        this.cargando = false; // Ocultar spinner
      }
    },
    abrirAlerta(alumno) {
      if(alumno.estadoUsuario == true){
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
      if(alumno.estadoUsuario == true){
        try {
          // Realizar la eliminación en el servidor
          await this.perfilService.updateEstadoUsuario(alumno.idUsuario, !alumno.estadoUsuario);
          Swal.fire("Estado cambiado", `El usuario "${alumno.usuario}" ha sido desactivado correctamente. Ahora no podrá acceder al sistema.`, "success");
          await this.mostrarAlumnos();
        } catch (error) {
          console.error("Error al eliminar el alumno:", error);
          Swal.fire("Error en la Operación", "No se pudo desactivar al usuario. Por favor, inténtalo más tarde.", "error");
        }
      }
    },
  },
  created() {
    this.cargarPerfil();
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
</style>
