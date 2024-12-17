<template>
  <div class="container mt-4">
    <h2 class="mb-4 text-center">Usuarios Activos</h2>
    <div class="row g-4">
      <div
        class="col-12 col-md-6 col-lg-4"
        v-for="usuario in usuariosActivos"
        :key="usuario.idUsuario"
      >
        <div class="card shadow-sm h-100">
          <div class="card-image-wrapper">
            <img
              :src="usuario.imagen"
              class="card-img-top"
              alt="Imagen de usuario"
            />
          </div>
          <div class="card-body">
            <h5 class="card-title text-primary">{{ usuario.usuario }}</h5>
            <p class="card-text mb-2">
              <strong>Email:</strong> {{ usuario.email }}
            </p>
            <p class="card-text mb-2">
              <strong>Curso:</strong> {{ usuario.curso }}
            </p>
            <p class="card-text mb-2">
              <strong>Estado:</strong> {{ usuario.estadoUsuario }}
            </p>
            <div class="d-flex justify-content-between">
              <button
                class="btn btn-outline-primary btn-sm"
                @click="openModal('curso', usuario.idUsuario)"
              >
                Cambiar Curso
              </button>
              <button
                class="btn btn-outline-success btn-sm"
                @click="openModal('rol', usuario.idUsuario)"
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
    class="modal fade show"
    id="cambioModal"
    tabindex="-1"
    aria-labelledby="cambioModalLabel"
    aria-hidden="true"
    v-if="isModalOpen"
    @click.self="closeModal"
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
            @click="closeModal"
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
  name: "AdminGestionUsuariosComponent",
  data() {
    return {
      usuariosActivos: [],
      roles: [],
      adminService: new AdminService(),
      modalTipo: "",
      usuarioId: null,
      nuevoValor: "",
      nuevoRol: null,
      isModalOpen: false, // Controlar la visibilidad del modal
    };
  },
  methods: {
    async cargarDatos() {
      try {
        this.usuariosActivos = await this.adminService.getUsuariosActivos();
      } catch (error) {
        console.error("Error al cargar usuarios activos:", error);
        alert("No se pudieron cargar los datos.");
      }
    },

    async cargarRoles() {
      try {
        const data = await this.adminService.getRoles();
        this.roles = data;
      } catch (error) {
        console.error("Error al cargar los roles:", error);
        alert("No se pudieron cargar los roles.");
      }
    },

    openModal(tipo, idUsuario) {
      this.modalTipo = tipo;
      this.usuarioId = idUsuario;
      this.nuevoValor = "";
      this.nuevoRol = null;
      if (this.modalTipo === "rol") {
        this.cargarRoles();
      }
      this.isModalOpen = true;
    },

    closeModal() {
      this.isModalOpen = false;
    },

    async guardarCambio() {
      try {
        if (this.modalTipo === "curso") {
          await this.adminService.updateCursoUsuario(
            this.usuarioId,
            this.nuevoValor
          );
          Swal.fire("¡Éxito!", "Curso actualizado correctamente.", "success").then(
            () => {
              this.cargarDatos();
              this.closeModal(); // Cierra el modal
            }
          );
        } else if (this.modalTipo === "rol") {
          await this.adminService.updateRolUsuario(
            this.usuarioId,
            this.nuevoRol
          );
          Swal.fire("¡Éxito!", "Rol actualizado correctamente.", "success").then(
            () => {
              this.cargarDatos();
              this.closeModal();
            }
          );
        }
      } catch (error) {
        console.error("Error al cambiar valor:", error);
        Swal.fire("¡Error!", "No se pudo actualizar el valor.", "error");
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

.modal.show {
  display: block;
}
</style>
