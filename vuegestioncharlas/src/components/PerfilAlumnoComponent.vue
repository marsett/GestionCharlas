<template>
  <div class="container mt-5">
    <div v-if="usuario">
      <div class="card shadow-sm text-center text-md-start profile-container">
        <div class="profile-header"></div>
        <div class="profile-back">
          <div class="row align-items-center position-relative">
            <div class="col-12 col-md-4 position-absolute start-50 translate-middle">
              <img :src="usuario.imagen" alt="Foto de perfil" class="img-fluid rounded-circle profile-image mb-3" />
            </div>
            <div class="col-12 col-md-8 offset-md-4 mt-3 pt-3">
              <h1 class="name">{{ usuario.nombre }} {{ usuario.apellidos }}</h1>
              <p class="bio">{{ usuario.idRole === 2 ? "Alumno" : "Profesor" }}</p>
              <div class="profile-buttons mt-3">
                <button class="btn btn-secondary btn-password me-2" @click="activarEdicion">Editar Contraseña</button>
                <button class="btn btn-success btn-activo" :class="{'active': usuario.estadoUsuario === 'Activo'}">Activo</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr>
      <CharlasAlumnoComponent :usuario="usuario" />
      </div>
    <div v-else>
      <p>Cargando perfil...</p>
    </div>
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
  max-width: 100%;
  margin: 0 auto;
}

.profile-header {
  position: relative;
  width: 100%;
  height: 200px;
  background-color: rgb(230, 159, 133);
}

.profile-back {
  background-color: #98cce4;
  padding-top: 60px;
  width: 100%;
  padding-bottom: 20px;
}

.profile-image {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 3px solid #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.name {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-top: 60px;
}

.bio {
  font-size: 14px;
  color: #777;
  margin: 10px 0;
}

.profile-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-password,
.btn-activo {
  height: 40px;
  width: 150px;
  border-radius: 20px;
  background-color: #6c757d;
  font-size: 14px;
  color: white;
  cursor: pointer;
}

.btn-password:hover,
.btn-activo:hover {
  background-color: #5a6268;
}

@media (min-width: 768px) {
  .profile-container {
    padding: 30px;
    border-radius: 10px;
  }

  .profile-header {
    height: 200px;
  }

  .profile-image {
    width: 150px;
    height: 150px;
    bottom: -30px;
    left: -40%;
    transform: translateX(-50%);
  }

  .profile-back {
    padding-top: 40px;
    margin-top: -40px
  }
}
</style>
