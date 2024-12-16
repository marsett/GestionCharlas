<template>
  <div class="mt-4">
    <h2>Profesores</h2>
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
        <tr v-for="profesor in profesores" :key="profesor.idUsuario">
          <td>
            <img :src="profesor.imagen" />
          </td>
          <td>{{ profesor.usuario }}</td>
          <td>{{ profesor.email }}</td>
          <td>{{ profesor.curso }}</td>
          <td>{{ profesor.estadoUsuario }}</td>
          <td>
            <button
              class="btn btn-warning btn-sm"
              @click="
                cambiarEstadoProfesor(profesor.idUsuario, profesor.estado)
              "
            >
              Cambiar Estado
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
  name: "AdminGestionProfesoresComponent",
  data() {
    return {
      profesores: [],
      adminService: new AdminService(),
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
    async cambiarEstadoProfesor(idUsuario, estadoActual) {
      try {
        const nuevoEstado = estadoActual === "Activo" ? "Inactivo" : "Activo";
        await this.adminService.updateEstadoProfesor(idUsuario, nuevoEstado);
        alert("Estado actualizado correctamente.");
        this.cargarDatos();
      } catch (error) {
        console.error("Error al cambiar estado:", error);
        alert("No se pudo cambiar el estado.");
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
