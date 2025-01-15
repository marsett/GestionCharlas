<template>
  <div class="profile-container" v-if="usuario">
    <!-- Sección de perfil -->
    <div class="profile-header">
      <img :src="usuario.imagen" alt="Foto de perfil" class="profile-image" />
    </div>

    <div class="profile-back">
      <div class="profile-details">
        <h1 class="name">{{ usuario.nombre }} {{ usuario.apellidos }}</h1>
        <p class="bio">{{ usuario.idRole === 2 ? "Alumno" : "Profesor" }}</p>
      </div>

      <!-- Contenedor para los botones -->
      <div class="profile-buttons">
        <button class="btn-password" @click="activarEdicion">Editar Contraseña</button>
        <button class="btn-activo" :class="{'active': usuario.estadoUsuario === 'Activo'}">Activo</button>
      </div>

      <hr>

      <!-- Componente para mostrar las charlas dinámicamente -->
      <CharlasAlumnoComponent :usuario="usuario" />
    </div>
  </div>
  <div v-else>
    <p>Cargando perfil...</p>
  </div>
</template>

<script>
import PerfilService from "@/services/PerfilService";
import CharlasAlumnoComponent from "@/components/CharlasAlumnoComponent";

export default {
  name: "PerfilAlumnoComponent",
  components: {
    CharlasAlumnoComponent
  },
  data() {
    return {
      usuario: null,
      perfilService: new PerfilService(),
    };
  },
  methods: {
    async cargarPerfil() {
      try {
        const data = await this.perfilService.getUsuarioPerfil();
        this.usuario = data.usuario; // Los datos de usuario incluyen la información de charlas
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
        alert("No se pudo cargar la información del perfil.");
      }
    },
    activarEdicion() {
      this.$router.push("/editar-perfil"); // Redirige a la página de edición del perfil
    },
  },
  created() {
    this.cargarPerfil(); // Cargar perfil al crear el componente
  },
};
</script>

<style scoped>
.profile-container {
  max-width: 80%;
  margin: 0 auto;
  padding: 60px;
  border-radius: 20px;
}

.profile-header {
  position: relative;
  border-radius: 10px 10px 0px 0px;
  width: 100%;
  height: 150px;
  background-color: rgb(236, 132, 94);
}

.profile-back {
  background-color: #cccbcb; /* Gris más suave */
  padding-top: 40px;
  border-radius: 0 0 20px 20px;
  width: 100%;
  padding-bottom: 20px;
}

.profile-image {
  position: absolute;
  bottom: -80px;
  left: 25px;
  width: 150px;
  height: 150px;
  border-radius: 15px;
  border: 3px solid #fff;
}

.profile-details {
  text-align: center;
  margin-top: 60px;

}

.name {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.bio {
  font-size: 14px;
  color: #777;
  margin: 10px 0;
}

.profile-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  margin-inline-end: 20px;
  gap: 20px;
}

.btn-password,
.btn-activo {
  border: 2px solid #888;
  height: 30px;
  width: 150px;
  border-radius: 20px;
  background-color: #9c9b9b;
  font-size: 14px;
  color: white;
  cursor: pointer;
}

.btn-password:hover,
.btn-activo:hover {
  background-color: #808080;
}

</style>
