<template>
  <div class="container my-4 p-4">
    <!-- Mostrar spinner mientras se cargan los alumnos -->
    <div v-if="cargando" class="d-flex justify-content-center my-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <!-- Mostrar mensaje si no hay alumnos -->
    <div
      v-if="!alumnos.length && !cargando"
      class="alert alert-warning text-center my-4"
    >
      No hay alumnos en el curso.
    </div>

    <!-- Tarjetas de Usuarios -->
    <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-1 d-flex">
      <div class="col" v-for="alumno in alumnos" :key="alumno.alumno.idUsuario">
        <div class="card-usuario">
          <div class="card-encabezado" style="background-color: #7782c6">
            <i
              class="fas fa-info-circle info-icon"
              @click="mostrarInformacionUsuario(alumno)"
            ></i>
          </div>
          <div class="card-cuerpo">
            <div class="profile-info">
              <img :src="alumno.alumno.imagen" />
              <div class="user-details">
                <div class="titulo" style="font-weight: 600">
                  {{ alumno.alumno.usuario }}
                </div>
                <div class="user-curso subtitulo" style="font-size: 13px">
                  {{ alumno.alumno.email }}
                </div>
              </div>
            </div>
            <div class="btn-group">
              <button @click="abrirAlerta(alumno.alumno)">Desactivar</button>
            </div>
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
  name: "AlumnosCursoProfesorComponent",
  props: ["idCurso"],
  data() {
    return {
      alumnos: [],
      cargando: false,
      perfilService: new PerfilService(),
    };
  },
  methods: {
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
        Swal.fire({
          title: "Desactivando...",
          text: "Por favor, espere mientras se desactiva al usuario.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        try {
          // Realiza la actualización en la API para desactivar al alumno
          await this.perfilService.updateEstadoUsuario(
            alumno.idUsuario,
            !alumno.estadoUsuario
          );

          // Recarga los datos de los alumnos
          await this.cargarAlumnos();

          // Muestra un mensaje de éxito y cierra el SweetAlert
          Swal.fire(
            "¡Éxito!",
            `El usuario "${alumno.usuario}" ha sido desactivado.`,
            "success"
          );
        } catch (error) {
          // Muestra un mensaje de error sin cerrar el SweetAlert principal
          Swal.fire({
            title: "¡Error!",
            text: "No se pudo desactivar el usuario. Por favor, inténtelo de nuevo.",
            icon: "error",
            confirmButtonText: "Cerrar",
          });
        }
      }
    },

    mostrarInformacionUsuario(alumno) {
      Swal.fire({
        title: "Información del Usuario",
        html: `
      <strong>Nombre:</strong> ${alumno.alumno.usuario}<br>
      <strong>Curso:</strong> ${alumno.alumno.curso}<br>
      <strong>Email:</strong> ${alumno.alumno.email}<br>
      <strong>Charlas totales:</strong> ${
        alumno.charlasTotales
      }<br> <!-- Aquí accedes a charlasTotales -->
      <strong>Estado:</strong> ${
        alumno.alumno.estadoUsuario ? "Activo" : "Inactivo"
      }
    `,
        icon: "info",
        confirmButtonText: "OK",
      });
    },
    async cargarAlumnos() {
      try {
        this.seccionActiva = "alumnos";
        this.cargando = true;
        const data = await this.perfilService.getAlumnosCursoProfesor();
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
        this.cargando = false;
      }
    },
  },
  created() {
    this.cargarAlumnos();
  },
};
</script>

<style scoped>
.card-usuario:last-child {
  margin-right: 0;
}

.user-curso {
  font-size: 14px;
}

.btn-group button {
  background-color: #cbcbcb;
  border: none;
  padding: 8px 15px;
  margin: 5px;
  border-radius: 15px;
  cursor: pointer;
  transition: background-color 0.3s;
  flex: 1;
}

.btn-group button:hover {
  background-color: #c0c0c0;
}

.container {
  background-color: #d9d9d9;
  border-radius: 16px;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.card-usuario {
  width: 100%;
  max-width: 480px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  margin-bottom: 20px;
}

.card-encabezado {
  background-color: #ff7a00;
  height: 100px;
  position: relative;
}

.info-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  color: white;
  cursor: pointer;
}

.card-cuerpo {
  background-color: #a3a3a3;
  padding: 20px;
  text-align: center;
  position: relative;
  margin-top: -30px;
  z-index: 1;
}

.profile-info {
  display: block;
  align-items: center;
  justify-content: center;
  margin-top: -60px;
}

.profile-info img {
  width: 100px;
  height: 100px;
  border-radius: 10%;
  margin-bottom: 20px;
}

.user-details {
  text-align: center;
}

.btn-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

@media (max-width: 991px) {
  .d-flex {
    display: grid !important;
    justify-content: center !important;
  }
}

.swal2-cancel.btn-red {
  background-color: #ff4d4f !important; /* Rojo intenso */
  color: white !important; /* Texto blanco */
  border: none !important; /* Sin borde */
  box-shadow: none !important; /* Sin sombra */
}
</style>
