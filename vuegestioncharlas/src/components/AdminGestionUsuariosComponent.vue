<template>
  <div class="mt-4">
    <h2>Usuarios Activos</h2>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Imagen</th>
          <th>Usuario</th>
          <th>Email</th>
          <th>Curso</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="usuario in usuariosActivos" :key="usuario.idUsuario">
          <td>
            <img :src="usuario.imagen" style='width: 50px; height: 50px;'/>
          </td>
          <td>{{ usuario.usuario }}</td>
          <td>{{ usuario.email }}</td>
          <td>{{ usuario.curso }}</td>
          <td>{{ usuario.estadoUsuario }}</td>
          <td>
            <button
              class="btn btn-primary btn-sm"
              @click="cambiarCursoUsuario(usuario.idUsuario)"
            >
              Cambiar Curso
            </button>
            <button
              class="btn btn-success btn-sm"
              @click="cambiarRolUsuario(usuario.idUsuario)"
            >
              Cambiar Rol
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import AdminService from "@/services/AdminService";

export default {
  name: "AdminGestionUsuariosComponent",
  data() {
    return {
      usuariosActivos: [],
      adminService: new AdminService(),
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
    async cambiarCursoUsuario(idUsuario) {
      const nuevoCurso = prompt("Introduce el ID del nuevo curso:");
      if (nuevoCurso) {
        try {
          await this.adminService.updateCursoUsuario(idUsuario, nuevoCurso);
          alert("Curso actualizado correctamente.");
          this.cargarDatos();
        } catch (error) {
          console.error("Error al cambiar curso:", error);
          alert("No se pudo cambiar el curso.");
        }
      }
    },
    async cambiarRolUsuario(idUsuario) {
      const nuevoRol = prompt("Introduce el ID del nuevo rol:");
      if (nuevoRol) {
        try {
          await this.adminService.updateRolUsuario(idUsuario, nuevoRol);
          alert("Rol actualizado correctamente.");
          this.cargarDatos();
        } catch (error) {
          console.error("Error al cambiar rol:", error);
          alert("No se pudo cambiar el rol.");
        }
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
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}
</style>
