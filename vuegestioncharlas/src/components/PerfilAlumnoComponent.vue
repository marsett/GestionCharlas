<template>
  <div class="container mt-5" v-if="usuario">
    <div class="profile-card">
      <div
        class="profile-header"
        style="background-color: #7787bd; height: 200px"
      >
        <div class="profile-info text-center"></div>
      </div>

      <div class="profile-content row align-items-center position-relative">
        <div class="col-12 col-md-3 d-flex justify-content-center mb-3 mb-md-0">
          <!-- Cambié col-md-4 por col-md-3 -->
          <img
            :src="usuario.imagen"
            alt="Foto de perfil"
            class="profile-image"
            @click="triggerFileInput"
          />
          <i class="fa fa-pencil edit-icon" @click="triggerFileInput"></i>
          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            style="display: none"
            @change="handleFileChange"
          />
          <button class="button-detalle" @click="mostrarDetalles">
            Detalles
          </button>
        </div>
        <div class="col-12 col-md-9 mt-3 pt-3">
          <h1 class="name text-center text-md-start">
            {{ usuario.nombre }} {{ usuario.apellidos }}
          </h1>
          <p class="bio text-center text-md-start">
            {{ usuario.idRole === 2 ? "Alumno" : "Profesor" }}
          </p>
          <div
            class="profile-buttons mt-3 d-flex justify-content-end flex-column flex-md-row"
          >
            <button
              class="btn btn-password me-2"
              @click="mostrarFormularioContrasena()"
            >
              Editar Contraseña
            </button>
            <button
              class="btn btn-activo"
              :class="{ active: usuario.estadoUsuario === 'Activo' }"
              @click="mostrarEstadoActivo"
            >
              {{ usuario.estadoUsuario === true ? "Activo" : "Inactivo" }}
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
import Swal from "sweetalert2";
import PerfilService from "@/services/PerfilService";
import CharlasAlumnoComponent from "@/components/CharlasAlumnoComponent";

export default {
  name: "PerfilAlumnoComponent",
  components: {
    CharlasAlumnoComponent,
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
        Swal.fire(
          "Error",
          "No se pudo cargar la información del perfil.",
          "error"
        );
      }
    },
    mostrarDetalles() {
      Swal.fire({
        title: "Detalles del Usuario", // Título del SweetAlert
        html: `
        <div style="text-align: left;">
          <strong>Nombre:</strong> ${this.usuario.nombre} <br>
          <strong>Apellidos:</strong> ${this.usuario.apellidos} <br>
          <strong>Email:</strong> ${this.usuario.email} <br>
          <strong>Curso Actual:</strong> ${this.usuario.curso} <br>
          <strong>Estado:</strong> ${
            this.usuario.estadoUsuario ? "Activo" : "Inactivo"
          } <br>
          </div>
        `,
        icon: "info", // Tipo de ícono (puedes cambiarlo por otro si lo deseas)
        confirmButtonText: "Cerrar", // Botón para cerrar el alert
      });
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
          popup: "swal-popup-bootstrap",
          title: "swal-title-bootstrap",
          input: "swal-input-bootstrap",
          confirmButton: "swal-confirm-btn",
          cancelButton: "swal-cancel-btn",
        },
        preConfirm: async () => {
          const contraseniaNueva =
            Swal.getPopup().querySelector("#contraseniaNueva").value;

          // Validación de la contraseña: debe tener entre 8 y 20 caracteres, letras y números, y sin caracteres especiales ni espacios
          const regex =
            /^(?=.*[a-zA-Z])(?=.*\d)(?!.*\s)(?!.*[^a-zA-Z0-9]).{8,20}$/;

          if (!contraseniaNueva) {
            Swal.showValidationMessage(
              "Por favor, llena el campo de la nueva contraseña"
            );
            return false;
          }

          if (!regex.test(contraseniaNueva)) {
            Swal.showValidationMessage(
              "La contraseña debe tener entre 8 y 20 caracteres, incluir letras y números, y no contener espacios ni caracteres especiales"
            );
            return false;
          }

          try {
            await this.perfilService.updateContrasenia(contraseniaNueva);
            Swal.fire("Éxito", "Contraseña actualizada con éxito", "success");
          } catch (error) {
            console.error("Error al actualizar la contraseña:", error);
            Swal.fire("Error", "No se pudo actualizar la contraseña.", "error");
          }
        },
      });
    },
    cancelarEdicion() {
      this.editMode = false; // Cancelar edición
      this.editedUsuario = { ...this.usuario }; // Revertir cambios no guardados
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    async handleFileChange(event) {
      const file = event.target.files[0];
      if (!file) return; // Si no se seleccionó archivo, salir
      try {
        const base64Content = await this.convertFileToBase64(file);
        await this.perfilService.uploadUserImage(
          this.usuario.idUsuario,
          file.name,
          base64Content
        );
        this.usuario.imagen = URL.createObjectURL(file); // Actualiza la imagen mostrada
      } catch (error) {
        console.error("Error al subir la imagen:", error);
        alert("No se pudo subir la imagen. Inténtalo de nuevo.");
      }
    },
    convertFileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]); // Solo el contenido base64
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    },

    mostrarEstadoActivo() {
      const estado = this.usuario.estadoUsuario; // Obtener el estado del usuario

      // Condicional para mostrar un mensaje según el estado
      Swal.fire({
        title: "Estado del Usuario",
        text: `Este usuario está ${estado ? "activo" : "inactivo"}`,
        icon: estado ? "success" : "warning",
        confirmButtonText: "Aceptar",
      });
    },
  },
  created() {
    this.cargarPerfil();
  },
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
  object-fit: cover;
  border: 4px solid #314b78;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: -200px;
  margin-right: -120px; /* Añadimos este margen */
}

.image-container {
  position: relative;
  display: inline-block;
}

.edit-icon {
  height: 10%;
  position: relative;
  top: -200px;
  right: -120px;
  font-size: 20px;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
}

.edit-icon:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

@media (max-width: 768px) {
  .edit-icon {
    height: 10%;
    position: relative;
    top: -100px;
    right: -5px;
    font-size: 20px;
    color: white;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 8px;
    border-radius: 50%;
    cursor: pointer;
    z-index: 10;
  }
}

@media (max-width: 768px) {
  .profile-image {
    width: 200px;
    height: 200px;
    border-radius: 20px;
    border: 8px solid #e0e0e0;
    object-fit: cover;
    margin-top: -100px;
    margin-right: -5px; /* Añadimos este margen */
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
  margin: 60px;
  margin-top: -10px;
}

.bio {
  font-size: 14px;
  color: #777;
  font-weight: bold;
  margin: 30px 0;
  text-align: center;
  margin: 60px;
  margin-top: -30px;
}

.profile-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
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
    justify-content: flex-end;
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
  background-color: #4caf50;
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

.button-detalle {
  position: absolute;
  top: -180px; /* Separación desde la parte superior */
  right: 40px; /* Separación desde la parte derecha */
  background-color: #5467a5;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  z-index: 10; /* Asegura que esté encima de otros elementos */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 1.2em;
}

.button-detalle:hover {
  background-color: #fff;
}

@media (max-width: 768px) {
  .button-detalle {
    position: absolute;
    top: -170px; /* Ajuste para que esté un poco más cerca de la parte superior */
    left: 50%; /* Centra el botón horizontalmente */
    transform: translateX(-50%); /* Esto centra el botón */
    font-size: 1em; /* Ajuste de tamaño de fuente para pantallas más pequeñas */
    right: auto; /* Elimina la propiedad right en pantallas pequeñas */
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

  outline: none;
}

button:hover {
  background: #fff;
  color: #512399;
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
}
</style>
