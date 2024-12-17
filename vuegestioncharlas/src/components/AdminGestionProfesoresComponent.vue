<template>
  <div class="container mt-4">
    <h2 class="mb-4 text-center">Profesores Activos</h2>
    <div class="row g-4">
      <div
        class="col-12 col-md-6 col-lg-4"
        v-for="profesor in profesores"
        :key="profesor.idUsuario"
      >
        <div class="card shadow-sm h-100">
          <div class="card-image-wrapper">
            <img
              :src="profesor.imagen"
              class="card-img-top"
              alt="Imagen de profesor"
            />
          </div>
          <div class="card-body">
            <h5 class="card-title text-primary">{{ profesor.usuario }}</h5>
            <p class="card-text mb-2">
              <strong>Email:</strong> {{ profesor.email }}
            </p>
            <p class="card-text mb-2">
              <strong>Curso:</strong> {{ profesor.curso }}
            </p>
            <p class="card-text mb-2">
              <strong>Estado:</strong> {{ profesor.estadoUsuario }}
            </p>
            <div class="d-flex justify-content-between">
              <button
                class="btn btn-outline-warning btn-sm"
                @click="
                  cambiarEstadoProfesor(
                    profesor.idUsuario,
                    profesor.estadoUsuario
                  )
                "
              >
                Cambiar Estado
              </button>
              <button
                class="btn btn-outline-primary btn-sm"
                @click="openModal('curso', profesor.idUsuario)"
              >
                Cambiar Curso
              </button>
              <button
                class="btn btn-outline-success btn-sm"
                @click="openModal('rol', profesor.idUsuario)"
              >
                Cambiar Rol
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para cambiar Curso o Rol -->
  <div
    class="modal fade"
    id="cambioModal"
    tabindex="-1"
    aria-labelledby="cambioModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="cambioModalLabel">
            Cambiar {{ modalTipo }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="guardarCambio">
            <div class="mb-3" v-if="modalTipo === 'curso'">
              <label for="nuevoValor" class="form-label">Nuevo Curso</label>
              <input
                type="text"
                id="nuevoValor"
                v-model="nuevoValor"
                class="form-control"
                required
              />
            </div>

            <div class="mb-3" v-if="modalTipo === 'rol'">
              <label for="nuevoRol" class="form-label">Seleccionar Rol</label>
              <select
                id="nuevoRol"
                v-model="nuevoRol"
                class="form-select"
                required
              >
                <option
                  v-for="role in roles"
                  :key="role.idRole"
                  :value="role.idRole"
                >
                  {{ role.roleName }}
                </option>
              </select>
            </div>

            <button type="submit" class="btn btn-primary">Guardar</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminService from "@/services/AdminService";
import Swal from "sweetalert2";

export default {
  name: "AdminGestionProfesoresComponent",
  data() {
    return {
      profesores: [],
      roles: [], // Lista de roles
      adminService: new AdminService(),
      modalTipo: "", // Determina si es 'curso' o 'rol'
      profesorId: null, // Almacena el ID del profesor a modificar
      nuevoValor: "", // Almacena el valor ingresado en el formulario para el curso
      nuevoRol: null, // Almacena el rol seleccionado
    };
  },
  methods: {
    async cargarDatos() {
      try {
        this.profesores = await this.adminService.getProfesores();
      } catch (error) {
        console.error("Error al cargar profesores:", error);
        alert("No se pudieron cargar los datos.");
      }
    },

    // Método para cargar los roles desde la API
    async cargarRoles() {
      try {
        const data = await this.adminService.getRoles();
        this.roles = data; // Asigna los roles a la propiedad roles
      } catch (error) {
        console.error("Error al cargar los roles:", error);
        alert("No se pudieron cargar los roles.");
      }
    },

    openModal(tipo, idUsuario) {
      this.modalTipo = tipo; // Determina si es curso o rol
      this.profesorId = idUsuario; // Asigna el ID del profesor
      this.nuevoValor = ""; // Limpia el valor anterior para curso
      this.nuevoRol = null; // Limpia el rol seleccionado
      if (this.modalTipo === "rol") {
        this.cargarRoles(); // Carga los roles solo cuando se va a cambiar el rol
      }
      const modalElement = document.getElementById("cambioModal");
      const modal = new window.bootstrap.Modal(modalElement);
      modal.show();
    },

    async guardarCambio() {
      try {
        if (this.modalTipo === "curso") {
          await this.adminService.updateCursoUsuario(
            this.profesorId,
            this.nuevoValor
          );
          Swal.fire(
            "¡Éxito!",
            "Curso actualizado correctamente.",
            "success"
          ).then(() => {
            this.cargarDatos(); // Recarga los datos después de la actualización
            const modalElement = document.getElementById("cambioModal");
            const modal = new window.bootstrap.Modal(modalElement);
            modal.hide(); // Cierra el modal después de la alerta
          });
        } else if (this.modalTipo === "rol") {
          await this.adminService.updateRolUsuario(
            this.profesorId,
            this.nuevoRol
          );
          Swal.fire(
            "¡Éxito!",
            "Rol actualizado correctamente.",
            "success"
          ).then(() => {
            this.cargarDatos(); // Recarga los datos después de la actualización
            const modalElement = document.getElementById("cambioModal");
            const modal = new window.bootstrap.Modal(modalElement);
            modal.hide(); // Cierra el modal después de la alerta
          });
        }
        this.cargarDatos(); // Recarga los datos después de la actualización
        const modalElement = document.getElementById("cambioModal");
        const modal = new window.bootstrap.Modal(modalElement);
        modal.hide(); // Cierra el modal después de guardar
      } catch (error) {
        console.error("Error al cambiar valor:", error);
        Swal.fire("¡Error!", "No se pudo actualizar el valor.", "error");
      }
    },

    async cambiarEstadoProfesor(idUsuario, estadoActual) {
      try {
        const nuevoEstado = estadoActual === "Activo" ? "Inactivo" : "Activo";
        await this.adminService.updateEstadoProfesor(idUsuario, nuevoEstado);
        Swal.fire("¡Éxito!", "Estado actualizado correctamente.", "success");
        this.cargarDatos();
      } catch (error) {
        console.error("Error al cambiar estado:", error);
        Swal.fire("¡Error!", "No se pudo cambiar el estado.", "error");
      }
    },
  },

  created() {
    this.cargarDatos();
  },
};
</script>

<style scoped>
.container {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
}

.card {
  border: none;
  border-radius: 10px;
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 100%;
  overflow: hidden;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.card-img-top {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.card-body {
  padding: 15px;
}

.card-title {
  font-size: 1.25rem;
}

.card-text {
  font-size: 0.9rem;
}

.btn {
  font-size: 0.8rem;
}
</style>
