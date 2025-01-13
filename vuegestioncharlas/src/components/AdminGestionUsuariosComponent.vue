<template>
  <div class="container mt-4">
    <h2 class="mb-4 text-center">Gestión de Usuarios Activos</h2>
    <div class="row g-4">
      <div
        class="col-12 col-md-6 col-lg-4"
        v-for="usuario in usuariosActivos"
        :key="usuario.idUsuario"
      >
        <div class="card shadow h-100 border-0">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0 d-flex align-items-center">
              <i class="bi bi-person-circle me-2"></i>
              {{ usuario.usuario }}
            </h5>
          </div>
          <div class="card-body">
            <p class="card-text"><strong>Email:</strong> {{ usuario.email }}</p>
            <p class="card-text"><strong>Curso:</strong> {{ usuario.curso }}</p>
            <p class="card-text"><strong>Rol:</strong> {{ usuario.role }}</p>
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
      roles: [],
      cursos: [],
      modalAbierto: false,
      tipoCambio: "",
      datosCambio: {
        usuarioId: null,
        curso: "",
        rol: null,
      },
      adminService: new AdminService(),
    };
  },
  methods: {
    async cargarDatos() {
      try {
        // Obtén los datos de usuarios, cursos y relaciones curso-usuario
        const [usuarios, cursos, cursosUsuarios] = await Promise.all([
          this.adminService.getUsuariosActivos(),
          this.adminService.getCursos(),
          this.adminService.getCursosUsuarios(),
        ]);

        // Asigna los cursos a los usuarios mediante las relaciones
        const usuariosConCursos = usuarios.map((usuario) => {
          const relacion = cursosUsuarios.find(
            (cu) => cu.idUsuario === usuario.idUsuario
          );
          const curso = relacion
            ? cursos.find((c) => c.idCurso === relacion.idCurso)
            : null;

          return {
            ...usuario,
            cursoNombre: curso ? curso.nombre : "Sin curso",
            idCurso: curso ? curso.idCurso : null, // Incluye el idCurso
          };
        });

        this.usuariosActivos = usuariosConCursos.filter(
          (usuario) => usuario.role === "ALUMNO"
        );
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
      } catch (error) {
        console.error("Error al cargar roles:", error);
      }
    },
    abrirModalCambio(tipo, usuario) {
      console.log("Modal abierto para:", tipo, usuario);
      this.tipoCambio = tipo;
      this.datosCambio.usuarioId = usuario.idUsuario;

      if (tipo === "curso") {
        console.log("Id curso: " + usuario.idCurso);
        this.datosCambio.curso = usuario.idCurso;
      } else if (tipo === "rol") {
        this.datosCambio.rol = usuario.idRole;
        this.cargarRoles();
      } else if (tipo === "estado") {
        this.datosCambio.estado = usuario.activo; // Asumimos que tienes el campo `activo`
      }
      this.modalAbierto = true;
    },

    cerrarModal() {
      this.modalAbierto = false;
      this.tipoCambio = "";
      this.datosCambio = { usuarioId: null, curso: null, rol: null };
    },
    async guardarCambio() {
      console.log("Metodo guardarCambio ejecutado");
      try {
        if (this.tipoCambio === "curso") {
          console.log("Datos enviados al servicio:");
          console.log("Usuario ID:", this.datosCambio.usuarioId);
          console.log("Curso ID:", this.datosCambio.curso);

          await this.adminService.updateCursoUsuario(
            this.datosCambio.usuarioId,
            this.datosCambio.curso
          );

          // Actualiza directamente la lista de usuarios activos
          await this.cargarDatos(); // Recarga los datos actualizados

          // Actualiza la lista de usuarios activos
          const usuarioIndex = this.usuariosActivos.findIndex(
            (u) => u.idUsuario === this.datosCambio.usuarioId
          );
          if (usuarioIndex !== -1) {
            const nuevoCurso = this.cursos.find(
              (curso) => curso.idCurso === this.datosCambio.curso
            );
            if (nuevoCurso) {
              this.usuariosActivos[usuarioIndex].cursoNombre =
                nuevoCurso.nombre;
              this.usuariosActivos[usuarioIndex].idCurso = nuevoCurso.idCurso;
            }
          }

          console.log("Curso seleccionado:", this.datosCambio.curso);
        } else if (this.tipoCambio === "rol") {
          await this.adminService.updateRolUsuario(
            this.datosCambio.usuarioId,
            this.datosCambio.rol
          );

          await this.cargarDatos();

          // Elimina al usuario si deja de ser alumno
          const usuarioIndex = this.usuariosActivos.findIndex(
            (u) => u.idUsuario === this.datosCambio.usuarioId
          );
          if (
            usuarioIndex !== -1 &&
            this.roles.find((role) => role.idRole === this.datosCambio.rol)
              ?.roleName !== "ALUMNO"
          ) {
            this.usuariosActivos.splice(usuarioIndex, 1);
          }
        } else if (this.tipoCambio === "estado") {
          console.log("Cambiando estado:", {
            UsuarioID: this.datosCambio.usuarioId,
            Estado: this.datosCambio.estado,
          });

          await this.adminService.updateEstadoUsuario(
            this.datosCambio.usuarioId,
            this.datosCambio.estado
          );

          await this.cargarDatos();
        }

        this.cerrarModal(); // Cierra el modal inmediatamente

        Swal.fire(
          "¡Éxito!",
          `El ${this.tipoCambio} fue actualizado.`,
          "success"
        ).then(() => {
          this.cerrarModal(); // Cierra el modal tras confirmar el éxito
        });
      } catch (error) {
        Swal.fire(
          "¡Error!",
          `No se pudo actualizar el ${this.tipoCambio}.`,
          "error"
        );
        console.error("Error al guardar cambio:", error);
      }
    },
  },
  created() {
    this.cargarDatos();
  },
};
</script>

<style scoped>
.card-header {
  font-size: 1.1rem;
  font-weight: bold;
  background-color: #007bff;
  color: white;
}
.card-footer {
  background-color: #f9f9f9;
  display: flex;
  justify-content: space-between;
}
.modal-content {
  border-radius: 10px;
}
.modal-header {
  background-color: #007bff;
  color: white;
}
</style>