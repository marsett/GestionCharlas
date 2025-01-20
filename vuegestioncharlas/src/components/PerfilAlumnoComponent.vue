<template>
  <div class="container mt-5" v-if="usuario">
    <div class="profile-card">
      <div class="profile-header" style="background-color: #7787bd; height: 200px;">
        <div class="profile-info text-center">
        </div>
      </div>

      <div class="profile-content row align-items-center position-relative">
        <div class="col-12 col-md-4 d-flex justify-content-center">
          <img :src="usuario.imagen" alt="Foto de perfil" class="profile-image mb-3" @click="triggerFileInput"/>
          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            style="display: none"
            @change="handleFileChange"
          />
        </div>
        <div class="col-12 col-md-8 mt-3 pt-3">
          <h1 class="name text-center text-md-start">{{ usuario.nombre }} {{ usuario.apellidos }}</h1>
          <p class="bio text-center text-md-start">{{ usuario.idRole === 2 ? "Alumno" : "Profesor" }}</p>
          <div class="profile-buttons mt-3 d-flex justify-content-center flex-column flex-md-row">
            <button class="btn btn-password me-2" @click="mostrarFormularioContrasena()">Editar Contraseña</button>
            <button class="btn btn-activo" :class="{'active': usuario.estadoUsuario === 'Activo'}" @click="mostrarEstadoActivo">
              {{ usuario.estadoUsuario === 'Activo' ? 'Activo' : 'Inactivo' }}
            </button>
          </div>
        </div>
      </div>

      <hr />
      <CharlasAlumnoComponent :usuario="usuario" />
    </div>
  </div>

  <div v-else>
    <p>Cargando perfil...</p>
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
      const estado = this.usuario.estadoUsuario; // Obtener el estado del usuario

      // Condicional para mostrar un mensaje según el estado
      Swal.fire({
        title: "Estado del Usuario",
        text: `Este usuario está ${estado === 'Activo' ? 'activo' : 'inactivo'}`,
        icon: estado === 'Activo' ? "success" : "warning",
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

.profile-card {
  background-color: #e0e0e0;
  border-radius: 10px;
  padding: 20px;
}

.profile-header {
  background-color: #7787bd;
  height: 200px;
  border-radius: 10px 10px 0 0;
  display: flex;
  justify-content: center; 
  align-items: center;   
}

.profile-info {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.profile-image {
  width: 250px;
  height: 250px;
  border-radius: 20px; 
  border: 8px solid #e0e0e0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  object-fit: cover;
  margin-top: -100px;

}

@media (max-width: 768px) {
  .profile-image {
    width: 200px;
    height: 200px;
    border-radius: 20px; 
    border: 8px solid #e0e0e0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    object-fit: cover;
    margin-top: -100px;
  }

  .col-12.col-md-4 {
    display: flex;
    justify-content: center; 
    align-items: center;
  }
}

.name {
  font-size: 24px;
  font-weight: bold;
  color: #777;
  text-align: center;
}

.bio {
  font-size: 14px;
  color: #777;
  font-weight: bold;
  margin: 30px 0;
  text-align: center;

}

.profile-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.profile-buttons button {
  width: auto;
  margin: 5px;
  padding: 10px 15px;
}

@media (max-width: 768px) {
  .profile-buttons {
    flex-direction: row;
    justify-content: center;
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

.swal-confirm-btn, .swal-cancel-btn {
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

button:before, button:after {
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

button:hover:before, button:hover:after {
  width: 100%;
  transition: 800ms ease all;
}

@media (max-width: 768px) {
  button {
    height: 45px;
    font-size: 1em;
  }
}

</style>
