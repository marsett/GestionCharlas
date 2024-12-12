<template>
  <div class="login-background">
    <div class="login-container">
      <div class="card shadow-lg mx-2 mx-md-0">
        <div class="card-body">
          <h3 class="card-title text-center mb-4">Iniciar sesión</h3>

          <!-- Formulario -->
          <form @submit.prevent="loginUser">
            <!-- Campo para el nombre de usuario -->
            <div class="mb-3">
              <label for="userName" class="form-label">Correo educativo:</label>
              <input
                type="text"
                id="userName"
                class="form-control"
                v-model="userName"
                required
                placeholder="username@tajamar365.com"
              />
            </div>

            <!-- Campo para la contraseña -->
            <div class="mb-3">
              <label for="password" class="form-label">Contraseña</label>
              <input
                type="password"
                id="password"
                class="form-control"
                v-model="password"
                required
                placeholder="Zanah0ri4"
              />
            </div>

            <!-- Botón de envío -->
            <button type="submit" class="btn btn-primary w-100">
              Iniciar sesión
            </button>
          </form>

          <p class="mt-3 text-center">
            ¿No tienes cuenta? <a href="#" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Regístrate aquí</a>
          </p>
        </div>
      </div>
    </div>

    <!-- Modal del formulario de registro -->
    <div
      class="modal fade"
      id="staticBackdrop"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-secondary-subtle">
            <h1 class="modal-title fs-5" id="staticBackdropLabel">Crear tu cuenta</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="row">
                <!-- Nombre -->
                <div class="col-12 col-lg-6 mb-3">
                  <label for="nombre" class="form-label">Nombre</label>
                  <input
                    type="text"
                    class="form-control"
                    id="nombre"
                    v-model="form.nombre"
                    required
                  />
                </div>
                <!-- Apellidos -->
                <div class="col-12 col-lg-6 mb-3">
                  <label for="apellidos" class="form-label">Apellidos</label>
                  <input
                    type="text"
                    class="form-control"
                    id="apellidos"
                    v-model="form.apellidos"
                    required
                  />
                </div>
              </div>
              <div class="row">
                <!-- Correo electrónico -->
                <div class="col-12 col-lg-6 mb-3">
                  <label for="email" class="form-label">Correo electrónico</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    v-model="form.email"
                    placeholder="username@tajamar365.com"
                    required
                  />
                </div>
                <!-- Contraseña -->
                <div class="col-12 col-lg-6 mb-3">
                  <label for="password" class="form-label">Contraseña</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    v-model="form.password"
                    required
                  />
                </div>
              </div>
              <div class="row">
                <!-- Imagen de perfil -->
                <div class="col-12 col-lg-6 mb-3">
                  <label for="imagen" class="form-label">Imagen de perfil (URL)</label>
                  <input
                    type="url"
                    class="form-control"
                    id="imagen"
                    v-model="form.imagen"
                  />
                </div>
                <!-- Rol -->
                <div class="col-12 col-lg-6 mb-3">
                  <label for="idRole" class="form-label">Rol</label>
                  <select
                    class="form-select"
                    id="idRole"
                    v-model="form.idRole"
                    required
                  >
                    <option value="" disabled selected>--- Seleccionar ---</option>
                    <option v-for="role in roles" :key="role.idRole" :value="role.idRole">
                      {{ role.roleName }}
                    </option>
                  </select>
                </div>
                <!-- Contraseña especial si seleccionan "Profesor" -->
                <div class="col-12 col-lg-6 mb-3 text-end" v-if="form.idRole === 1">
                </div>
                <div class="col-12 col-lg-6 mb-3" v-if="form.idRole === 1">
                  <label for="profesorPassword" class="form-label">Clave de acceso</label>
                  <input
                    type="password"
                    id="profesorPassword"
                    v-model="profesorPassword"
                    class="form-control" 
                    placeholder="Introduce tu clave de profesor"
                  />
                </div>

              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="cerrarFormCrear">Cancelar</button>
            <button 
              type="button" 
              class="btn btn-primary" 
              :disabled="!form.nombre || !form.apellidos || !form.email || !form.password || !form.idRole" 
              @click="registerUser"
            >Crear</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Cookies from 'cookies-js';
  import AuthService from '@/services/AuthService';

  const service = new AuthService();

  export default {
    data() {
      return {
        userName: "amanda.crespo@tajamar365.com",
        password: "Am123456",
        form: {
          idUsuario: 0,
          nombre: "",
          apellidos: "",
          email: "",
          estadoUsuario: true,
          imagen: "",
          password: "",
          idRole: "",
        },
        roles: [],
        profesorPassword: "",
        correctProfesorPassword: "AcC3soT4jaMar+Pr@ff", 
      };
    },
    mounted(){
      service.getRoles()
      .then(response => {
        this.roles = response;
      })
      .catch(error => {
        console.error('Error al obtener los roles: ', error);
      });
    },
    methods: {
      loginUser() {
        service.getToken(this.userName, this.password)
        .then(response => {
          let fechaCaducidad = new Date();
          fechaCaducidad.setTime(fechaCaducidad.getTime() + (2 * 60 * 60 * 1000)); // 2 horas en milisegundos

          let token = 'bearer ' + response;
          Cookies.set('bearer_token', token, { expires: fechaCaducidad });

          this.$router.push('/');
        })
        .catch(error => {
          console.error('Error al obtener el token:', error);
          alert('Usuario o contraseña incorrectos.'); //? Sweet alert 
        });
      },
      registerUser() {
        if (!this.form.nombre || !this.form.apellidos || !this.form.email || !this.form.password || !this.form.idRole) {
          alert("Por favor, complete todos los campos obligatorios.");
          return;
        }

        // Verificar si el rol seleccionado es "Profesor" y si se ingresó la contraseña correcta
        if (this.form.idRole === 1 && this.profesorPassword !== this.correctProfesorPassword) {
          alert("Contraseña incorrecta para el rol de Profesor.");
          return;
        }

        service.setUser(this.form)
        .then(response => {
          console.log(response);
          alert("Cuenta creada exitosamente!");
          this.clearForm();
          document.getElementById('cerrarFormCrear').click();
        })
        .catch(error => {
          console.error('Error al crear el usuario: ', error);
          alert('No se ha podido crear el usuario'); 
        });
      },
      clearForm() {
        this.form = {
          nombre: "",
          apellidos: "",
          email: "",
          password: "",
          imagen: "",
          idRole: "",
        };
      },
    },
  };
</script>

<style scoped>
  .login-background {
    background-color: #f0f0f0;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
  }

  .card {
    width: 100%;
    max-width: 500px;
    border-radius: 8px;
  }

  .card-body {
    padding: 2rem;
  }

  .form-control {
    border-radius: 8px;
  }

  .btn {
    border-radius: 8px;
  }

  /* Hacer que la tarjeta sea responsiva: en pantallas pequeñas, ocupa el 90% del ancho */
  @media (max-width: 768px) {
    .card {
      width: 90%;
    }
  }

  /* Ajustes para pantallas muy pequeñas, como teléfonos en modo vertical */
  @media (max-width: 480px) {
    .card {
      width: 100%;
    }
    .card-body {
      padding: 2rem 1.5rem;
    }
  }

  @media (max-width: 300px) {
    .card-body {
      padding: 2rem 1.1rem;
    }
  }
</style>
