<template>
  <div class="container my-4 p-4">
    <h2 class="mb-4 text-center">Gestión de Usuarios</h2>
    <div class="row row-cols-md-3 row-cols-1">
      <!-- Filtro por Rol -->
      <div class="col mb-3">
        <label for="filtroRol" class="form-label">Filtrar por Rol</label>
        <select
          id="filtroRol"
          class="form-select"
          v-model="rolSeleccionado"
          @change="filtrarUsuarios"
        >
          <option value="">Todos</option>
          <option v-for="role in roles" :key="role.idRole" :value="role.idRole">
            {{ role.roleName }}
          </option>
        </select>
      </div>

      <!-- Filtro por Curso -->
      <div class="col mb-3">
        <label for="filtroCurso" class="form-label">Filtrar por Curso</label>
        <select
          id="filtroCurso"
          class="form-select"
          v-model="cursoSeleccionado"
          @change="filtrarUsuarios"
        >
          <option value="">Todos</option>
          <option
            v-for="curso in cursos"
            :key="curso.idCurso"
            :value="curso.idCurso"
          >
            {{ curso.nombre }}
          </option>
        </select>
      </div>

      <!-- Filtro por Estado -->
      <div class="col mb-3">
        <label for="filtroEstado" class="form-label">Filtrar por Estado</label>
        <select
          id="filtroEstado"
          class="form-select"
          v-model="estadoSeleccionado"
          @change="filtrarUsuarios"
        >
          <option value="">Todos</option>
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </select>
      </div>
    </div>
    <!-- Mensaje cuando no hay usuarios filtrados -->
    <div v-if="noUsuariosMensaje" class="alert alert-warning text-center">
      {{ noUsuariosMensaje }}
    </div>

    <!-- <div class="row g-4">
      <div
        class="col-12 col-md-6 col-lg-4"
        v-for="usuario in usuariosFiltrados"
        :key="usuario.idUsuario"
      >
        <div class="card shadow h-100 border-0">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0 d-flex align-items-center">
              {{ usuario.nombre }} {{ usuario.apellidos }}
            </h5>
          </div>
          <div class="card-body">
            <p class="card-text"><strong>Email:</strong> {{ usuario.email }}</p>
            <p class="card-text">
              <strong>Curso:</strong> {{ usuario.cursoNombre }}
            </p>
            <p class="card-text">
              <strong>Rol:</strong> {{ usuario.rolNombre }}
            </p>
          </div>
          <div class="card-footer d-flex justify-content-between">
            <button
              class="btn btn-outline-primary btn-sm"
              @click="abrirModalCambio('curso', usuario)"
            >
              Cambiar Curso
            </button>
            <button
              class="btn btn-outline-success btn-sm"
              @click="abrirModalCambio('rol', usuario)"
            >
              Cambiar Rol
            </button>
            <button
              class="btn btn-outline-warning btn-sm"
              @click="abrirModalCambio('estado', usuario)"
            >
              Cambiar Estado
            </button>
          </div>
        </div>
      </div>
    </div> -->

    <!-- Tarjetas de Usuarios -->
    <div
      class="row row-cols-xl-3 row-cols-lg-2 row-cols-1 d-flex"
    >
      <div
        class="col"
        v-for="usuario in usuariosFiltrados"
        :key="usuario.idUsuario"
      >
        <div class="card-usuario">
          <div class="card-encabezado">
            <i class="fas fa-info-circle info-icon"></i>
          </div>
          <div class="card-cuerpo">
            <div class="profile-info">
              <img :src="usuario.imagen" />
              <div class="user-details">
                <div class="user-name">
                  {{ usuario.nombre }} {{ usuario.apellidos }}
                </div>
                <div class="user-curso">{{ usuario.cursoNombre }}</div>
              </div>
            </div>
            <div class="btn-group">
              <button @click="abrirModalCambio('curso', usuario)">
                Cambiar Curso
              </button>
              <button @click="abrirModalCambio('rol', usuario)">
                Cambiar Rol
              </button>
              <button @click="abrirModalCambio('estado', usuario)">
                Cambiar Estado
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal General -->
    <div
      v-if="modalAbierto"
      class="modal fade show"
      tabindex="-1"
      style="display: block; background: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Cambiar {{ tipoCambio }}</h5>
            <button
              type="button"
              class="btn-close"
              @click="cerrarModal"
            ></button>
          </div>
          <div class="modal-body">
            <div v-if="tipoCambio === 'curso'">
              <label for="nuevoCurso" class="form-label">Nuevo Curso</label>
              <select
                v-model="datosCambio.curso"
                id="nuevoCurso"
                class="form-select"
              >
                <option
                  v-for="curso in cursos"
                  :key="curso.idCurso"
                  :value="curso.idCurso"
                >
                  {{ curso.nombre }}
                </option>
              </select>
            </div>
            <div v-if="tipoCambio === 'rol'">
              <label for="nuevoRol" class="form-label">Nuevo Rol</label>
              <select
                v-model="datosCambio.rol"
                id="nuevoRol"
                class="form-select"
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
            <div v-if="tipoCambio === 'estado'">
              <label for="nuevoEstado" class="form-label">Nuevo Estado</label>
              <select
                v-model="datosCambio.estado"
                id="nuevoEstado"
                class="form-select"
              >
                <option :value="true">Activo</option>
                <option :value="false">Inactivo</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="cerrarModal"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="guardarCambio"
            >
              Guardar
            </button>
          </div>
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
      usuariosFiltrados: [],
      roles: [],
      cursos: [],
      cursosUsuarios: [],
      rolSeleccionado: "",
      cursoSeleccionado: "",
      estadoSeleccionado: "",
      modalAbierto: false,
      tipoCambio: "",
      datosCambio: {
        usuarioId: null,
        curso: "",
        rol: null,
        estado: null,
      },
      adminService: new AdminService(),
      noUsuariosMensaje: "",
    };
  },
  methods: {
    async cargarDatos() {
      try {
        const [usuarios, cursos, cursosUsuarios] = await Promise.all([
          this.adminService.getUsuarios(),
          this.adminService.getCursos(),
          this.adminService.getCursosUsuarios(),
          this.adminService.getRoles(),
        ]);

        this.cursosUsuarios = cursosUsuarios;

        const usuariosConCursos = usuarios.map((usuario) => {
          const relacion = cursosUsuarios.find(
            (cu) => cu.idUsuario === usuario.idUsuario
          );
          const curso = relacion
            ? cursos.find((c) => c.idCurso === relacion.idCurso)
            : null;

          const rol = this.roles.find((r) => r.idRole === usuario.idRole);

          return {
            ...usuario,
            cursoNombre: curso ? curso.nombre : "Sin curso",
            idCurso: curso ? curso.idCurso : null,
            rolNombre: rol ? rol.roleName : "Sin rol",
          };
        });

        this.usuariosActivos = usuariosConCursos;
        this.usuariosFiltrados = usuariosConCursos;
        this.cursos = cursos;
        console.log(
          "Datos de usuarios activos cargados:",
          this.usuariosActivos
        );
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    },
    async cargarRoles() {
      try {
        this.roles = await this.adminService.getRoles();
        console.log("Roles cargados:", this.roles);
      } catch (error) {
        console.error("Error al cargar roles:", error);
      }
    },

    filtrarUsuarios() {
      let usuariosFiltrados = this.usuariosActivos;

      if (this.rolSeleccionado !== undefined && this.rolSeleccionado !== "") {
        usuariosFiltrados = usuariosFiltrados.filter(
          (usuario) => usuario.idRole === this.rolSeleccionado
        );
      }

      if (
        this.cursoSeleccionado !== undefined &&
        this.cursoSeleccionado !== ""
      ) {
        usuariosFiltrados = usuariosFiltrados.filter(
          (usuario) => usuario.idCurso === this.cursoSeleccionado
        );
      }

      if (this.estadoSeleccionado !== "") {
        usuariosFiltrados = usuariosFiltrados.filter(
          (usuario) =>
            usuario.estadoUsuario === (this.estadoSeleccionado === "true")
        );
      }

      this.usuariosFiltrados = usuariosFiltrados;

      if (this.usuariosFiltrados.length === 0) {
        this.noUsuariosMensaje =
          "No se encontraron usuarios con los filtros seleccionados.";
      } else {
        this.noUsuariosMensaje = "";
      }
    },
    abrirModalCambio(tipo, usuario) {
      this.tipoCambio = tipo;
      this.datosCambio.usuarioId = usuario.idUsuario;

      if (tipo === "curso") {
        this.datosCambio.curso = usuario.idCurso;
      } else if (tipo === "rol") {
        this.datosCambio.rol = usuario.idRole;
        this.cargarRoles();
      } else if (tipo === "estado") {
        this.datosCambio.estado = usuario.activo;
      }
      this.modalAbierto = true;
    },

    cerrarModal() {
      this.modalAbierto = false;
      this.tipoCambio = "";
      this.datosCambio = { usuarioId: null, curso: null, rol: null };
    },

    async guardarCambio() {
      try {
        if (this.tipoCambio === "curso") {
          await this.adminService.updateCursoUsuario(
            this.datosCambio.usuarioId,
            this.datosCambio.curso
          );
          await this.cargarDatos();
        } else if (this.tipoCambio === "rol") {
          await this.adminService.updateRolUsuario(
            this.datosCambio.usuarioId,
            this.datosCambio.rol
          );
          await this.cargarDatos();
        } else if (this.tipoCambio === "estado") {
          await this.adminService.updateEstadoUsuario(
            this.datosCambio.usuarioId,
            this.datosCambio.estado
          );
          await this.cargarDatos();
        }
        this.cerrarModal();

        // resetear filtros
        this.rolSeleccionado = "";
        this.cursoSeleccionado = "";
        this.estadoSeleccionado = "";

        Swal.fire(
          "¡Éxito!",
          `El ${this.tipoCambio} fue actualizado.`,
          "success"
        );
      } catch (error) {
        Swal.fire(
          "¡Error!",
          `No se pudo actualizar el ${this.tipoCambio}.`,
          "error"
        );
      }
    },
  },
  created() {
    this.cargarRoles().then(() => {
      this.cargarDatos();
    });
  },
};
</script>

<style>
.card-usuario:last-child {
  margin-right: 0; /* Elimina el margen derecho de la última tarjeta */
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
  justify-content: center; /* Cambiar a 'center' para centrar tarjetas */
}

.card-usuario {
  width: 100%; /* Full width dentro de su columna de Bootstrap */
  max-width: 480px; /* Limitar ancho máximo */
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
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -60px;
}

.profile-info img {
  width: 100px;
  height: 100px;
  border-radius: 10%;
  margin-right: 20px;
}

.user-details {
  text-align: left;
}

.user-name {
  font-size: 18px;
  font-weight: bold;
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
</style>