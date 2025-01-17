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
                <button id="first" class="btn-password me-2" @click="mostrarFormularioContrasena()">Editar Contraseña</button>
                <button 
                  id="first" 
                  class="btn-activo" 
                  :class="{'active': usuario.estadoUsuario === 'Activo'}"
                  @click="mostrarEstadoActivo"
                >
                  Activo
                </button>
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
import Swal from 'sweetalert2';
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
        this.usuario = data.usuario;
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
        Swal.fire('Error', 'No se pudo cargar la información del perfil.', 'error');
      }
    },

    mostrarFormularioContrasena() {
      Swal.fire({
        title: "Editar Contraseña",
        html: `
          <div class="form-group">
            <input type="password" id="contraseniaNueva" class="form-control" placeholder="Contraseña Nueva">
          </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        customClass: {
          popup: 'swal-popup-bootstrap',
          title: 'swal-title-bootstrap',
          input: 'swal-input-bootstrap',
          confirmButton: 'swal-confirm-btn',
          cancelButton: 'swal-cancel-btn'
        },
        preConfirm: async () => {
          const contraseniaNueva = Swal.getPopup().querySelector('#contraseniaNueva').value;
          if (!contraseniaNueva) {
            Swal.showValidationMessage(`Por favor, llena el campo de la nueva contraseña`);
            return false;
          }

          try {
            await this.perfilService.updateContrasenia(contraseniaNueva);
            Swal.fire('Éxito', 'Contraseña actualizada con éxito', 'success');
          } catch (error) {
            console.error("Error al actualizar la contraseña:", error);
            Swal.fire('Error', 'No se pudo actualizar la contraseña.', 'error');
          }
        }
      });
    },

    mostrarEstadoActivo() {
      Swal.fire({
        title: "Estado del Usuario",
        text: "Este usuario está activo",
        icon: "info",
        confirmButtonText: "Aceptar"
      });
    }
  },
  created() {
    this.cargarPerfil();
  }
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
  bottom: 70px;
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
    bottom: 60px;
    left: -40%;
    transform: translateX(-50%);
  }

  .profile-back {
    padding-top: 40px;
  }
}

.swal-popup-bootstrap {
  border-radius: 0px !important;
  width: 100% !important;
  max-width: 500px;
  padding: 20px;
  box-sizing: border-box;
}

.swal-title-bootstrap {
  font-size: 22px;
  font-weight: bold;
  color: #333;
  text-align: center;
}

.swal-input-bootstrap {
  width: 100%;
  border-radius: 0px;
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}

.swal-confirm-btn,
.swal-cancel-btn {
  width: 48%;
  font-size: 16px;
  padding: 12px 0;
  border-radius: 0px;
}

.swal-confirm-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
}

.swal-cancel-btn {
  background-color: #f44336;
  color: white;
  border: none;
}

@media (max-width: 600px) {
  .swal-popup-bootstrap {
    width: 90%;
  }

  .swal-title-bootstrap {
    font-size: 18px;
  }

  .swal-input-bootstrap {
    font-size: 16px;
  }
}

button {
  background: #7787bd;
  color: #fff;
  border: none;
  position: relative;
  height: 50px;
  font-size: 1.2em;
  padding: 0 2em;
  cursor: pointer;
  transition: 800ms ease all;
  outline: none;
}

button:hover {
  background: #fff;
  color: #512399;
}

button:before,
button:after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  height: 2px;
  width: 0;
  background: #512399;
  transition: 400ms ease all;
}

button:after {
  right: inherit;
  top: inherit;
  left: 0;
  bottom: 0;
}

button:hover:before,
button:hover:after {
  width: 100%;
  transition: 800ms ease all;
}

@media (max-width: 768px) {
  button {
    height: 45px;
    font-size: 1em;
  }

  button:hover {
    background: #fff;
    color: #512399;
  }
}
</style>
