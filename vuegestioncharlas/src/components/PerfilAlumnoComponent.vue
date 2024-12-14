<template>
  <div class="container mt-5" v-if="usuario">
    <div
      class="card shadow-lg p-4 rounded"
      style="width: 100%; max-width: 1100px"
    >
      <div class="row text-center text-md-start">
        <div class="col-12 col-md-3 mb-4 mb-md-0">
          <img
            :src="usuario.imagen"
            alt="Foto de perfil"
            @click="triggerFileInput"
            class="profile-image img-fluid rounded-circle border-primary mb-3"
            style="width: 150px; height: 150px; object-fit: cover"
          />
          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            style="display: none"
            @change="handleFileChange"
          />
        </div>
        <div class="col-12 col-md-9">
          <h4 class="font-weight-bold">
            {{ usuario.nombre }} {{ usuario.apellidos }}
          </h4>
          <p class="text-muted">
            {{ usuario.idRole === 2 ? "Alumno" : "Profesor" }}
          </p>

          <div v-if="!editMode">
            <div class="list-group">
              <div class="list-group-item">
                <strong>Nombre:</strong> {{ usuario.nombre }}
              </div>
              <div class="list-group-item">
                <strong>Apellidos:</strong> {{ usuario.apellidos }}
              </div>
              <div class="list-group-item">
                <strong>Email:</strong> {{ usuario.email }}
              </div>
              <div class="list-group-item">
                <strong>Curso:</strong> {{ usuario.curso }}
              </div>
            </div>
          </div>

          <form v-else @submit.prevent="guardarCambios">
            <div class="mb-3">
              <label for="nombre" class="form-label"
                ><strong>Nombre:</strong></label
              >
              <input
                type="text"
                id="nombre"
                v-model="editedUsuario.nombre"
                class="form-control"
                required
              />
            </div>
            <div class="mb-3">
              <label for="apellidos" class="form-label"
                ><strong>Apellidos:</strong></label
              >
              <input
                type="text"
                id="apellidos"
                v-model="editedUsuario.apellidos"
                class="form-control"
                required
              />
            </div>
            <div class="mb-3">
              <label for="email" class="form-label"
                ><strong>Email:</strong></label
              >
              <input
                type="email"
                id="email"
                v-model="editedUsuario.email"
                class="form-control"
                required
              />
            </div>
            <div class="d-flex gap-3 mt-3">
              <button type="submit" class="btn btn-success">
                Guardar Cambios
              </button>
              <button
                type="button"
                class="btn btn-secondary"
                @click="cancelarEdicion"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>

      <div
        v-if="!editMode"
        class="d-flex gap-3 mt-4 justify-content-center justify-content-md-start"
      >
        <button class="btn btn-primary" @click="activarEdicion">
          Editar Perfil
        </button>
        <router-link class="nav-link" to="/charlasalumno">
          <button class="btn btn-primary">Mis Charlas</button>
        </router-link>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Cargando perfil...</p>
  </div>
</template>



<script>
import PerfilService from "@/services/PerfilService";
export default {
  name: "PerfilAlumnoComponent",
  data() {
    return {
      usuario: null, // Datos del usuario
      perfilService: new PerfilService(),
      editMode: false, // Estado de edición, inicialmente desactivado
      editedUsuario: {} // Almacenará los datos editados temporalmente
    };
  },
  methods: {
    async cargarPerfil() {
      try {
        const data = await this.perfilService.getUsuarioPerfil();
        this.usuario = data.usuario; // Guardamos los datos del usuario en el estado
        this.editedUsuario = { ...this.usuario }; // Inicializamos editedUsuario
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
        alert("No se pudo cargar la información del perfil.");
      }
    },
    activarEdicion() {
      this.editMode = true; // Activar el modo de edición
      this.editedUsuario = { ...this.usuario }; // Copiar los datos actuales al formulario
    },
    async guardarCambios() {
      try {
        // Llama al método editarPerfil con los datos del usuario actualizados
        await this.perfilService.editarPerfil({
          idUsuario: this.usuario.idUsuario,
          nombre: this.editedUsuario.nombre,
          apellidos: this.editedUsuario.apellidos,
          email: this.editedUsuario.email,
          estadoUsuario: this.usuario.estadoUsuario,
          imagen: this.usuario.imagen,
          password: this.usuario.password,
          idRole: this.usuario.idRole,
        });

        // Actualiza el estado del componente
        this.usuario = { ...this.usuario, ...this.editedUsuario };
        this.editMode = false; // Salir del modo de edición
        alert("Perfil actualizado con éxito.");
      } catch (error) {
        console.error("Error al guardar los cambios:", error);
        alert("No se pudo actualizar el perfil. Inténtalo de nuevo.");
      }
    },
    cancelarEdicion() {
      this.editMode = false; // Cancelar edición
      this.editedUsuario = { ...this.usuario }; // Revertir cambios no guardados
    },
    // Dispara el input de archivo
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    // Maneja el cambio de archivo y sube automáticamente
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
    // Convierte el archivo a Base64
    convertFileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]); // Solo el contenido base64
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    },
  },
  created() {
    this.cargarPerfil(); // Cargamos los datos al montar el componente
  },
};
</script>

<style scoped>
.profile-image {
  border: 4px solid #007bff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card {
  background-color: #f8f9fa;
}

.card h4 {
  color: #333;
}

.list-group-item {
  font-size: 1.1em;
  padding: 15px;
  border: 1px solid #ddd;
  background-color: #ffffff;
  margin-bottom: 10px;
}

.list-group-item strong {
  color: #007bff;
}

.btn-primary {
  font-size: 1.1em;
  padding: 12px 24px;
  border-radius: 5px;
}

.btn-primary:hover {
  background-color: #0056b3;
}

@media (min-width: 768px) {
  .card {
    padding: 30px;
  }

  .profile-image {
    width: 150px;
    height: 150px;
  }

  .btn-primary {
    font-size: 1.2em;
  }
}

@media (min-width: 1200px) {
  .container {
    max-width: 1200px;
  }
  .card {
    padding: 40px;
  }
  .profile-image {
    width: 180px;
    height: 180px;
  }
}
</style>
