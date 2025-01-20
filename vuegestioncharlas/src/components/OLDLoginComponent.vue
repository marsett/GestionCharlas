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
                :readonly="isLoading"
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
                placeholder="12345"
                :readonly="isLoading"
              />
            </div>

            <!-- Botón de envío -->
            <button
              type="submit"
              class="btn btn-primary w-100"
              :disabled="isLoading || !userName || !password"
            >
              Iniciar sesión
            </button>
          </form>

          <!-- Spinner de carga -->
          <div
            v-if="isLoading"
            class="position-absolute top-50 start-50 translate-middle"
          >
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
          </div>

          <p class="mt-3 text-center">
            ¿No tienes cuenta?
            <a href="#" data-bs-toggle="modal" data-bs-target="#staticBackdrop"
              >Regístrate aquí</a
            >
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
            <h1 class="modal-title fs-5" id="staticBackdropLabel">
              Crear tu cuenta
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="cerrarFormCrear"
            ></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="row">
                <!-- Nombre -->
                <div class="col-12 col-lg-6 mb-3">
                  <label for="nombre" class="form-label"
                    >Nombre <span class="text-danger">*</span></label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="nombre"
                    v-model="form.nombre"
                    :readonly="isLoading2"
                    required
                  />
                </div>
                <!-- Apellidos -->
                <div class="col-12 col-lg-6 mb-3">
                  <label for="apellidos" class="form-label"
                    >Apellidos <span class="text-danger">*</span></label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="apellidos"
                    v-model="form.apellidos"
                    :readonly="isLoading2"
                    required
                  />
                </div>
              </div>
              <div class="row">
                <!-- Correo electrónico -->
                <div class="col-12 col-lg-6 mb-3">
                  <label for="email" class="form-label"
                    >Correo electrónico
                    <span class="text-danger">*</span></label
                  >
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    v-model="form.email"
                    :readonly="isLoading2"
                    placeholder="username@tajamar365.com"
                    required
                  />
                </div>
                <!-- Contraseña -->
                <div class="col-12 col-lg-6 mb-3">
                  <label for="password" class="form-label"
                    >Contraseña <span class="text-danger">*</span></label
                  >
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    v-model="form.password"
                    :readonly="isLoading2"
                    required
                  />
                </div>
              </div>
              <div class="row">
                <!-- Rol -->
                <div class="col-12 col-lg-6 mb-3">
                  <label class="form-label">Rol <span class="text-danger">*</span></label>
                  <div>
                    <div class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        type="radio"
                        id="rolAlumno"
                        value="Alumno"
                        v-model="form.idRole"
                        :disabled="isLoading2"
                        required
                      />
                      <label class="form-check-label" for="rolAlumno">Alumno</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        type="radio"
                        id="rolProfesor"
                        value="Profesor"
                        v-model="form.idRole"
                        :disabled="isLoading2"
                        required
                      />
                      <label class="form-check-label" for="rolProfesor">Profesor</label>
                    </div>
                  </div>
                </div>

                <!-- Curso (solo para Alumno) -->
                <div class="col-12 col-lg-6 mb-3" v-if="form.idRole === 'Alumno'">
                  <label for="idCurso" class="form-label">
                    Curso <span class="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    id="idCurso"
                    v-model="form.idCurso"
                    :readonly="isLoading2"
                    class="form-control"
                    placeholder="XXXX"
                  />
                </div>

                <!-- Contraseña especial (solo para Profesor) -->
                <div class="col-12 col-lg-6 mb-3" v-if="form.idRole === 'Profesor'">
                  <label for="profesorPassword" class="form-label">
                    Clave de acceso <span class="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    id="profesorPassword"
                    v-model="profesorPassword"
                    :readonly="isLoading2"
                    class="form-control"
                    placeholder="Introduce tu clave de profesor"
                  />
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              id="cerrarFormCrear"
              @click="clearForm()"
              :disabled="isLoading2"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="btn btn-primary"
              :disabled="
                !form.nombre ||
                !form.apellidos ||
                !form.email ||
                !form.password ||
                !form.idRole ||
                isLoading2
              "
              @click="registerUser"
            >
              Crear
            </button>
          </div>
        </div>
      </div>

      <!-- Spinner de carga 2 -->
      <div
        v-if="isLoading2"
        class="position-absolute top-50 start-50 translate-middle"
      >
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from "cookies-js";
import Swal from "sweetalert2";
import AuthService from "@/services/AuthService";

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
        imagen:
          "https://fpprofessionaleducation.tajamar.es/wp-content/uploads/2019/04/escudo-positivo.jpg",
        password: "",
        idRole: "",
        idCurso: "",
      },
      isLoading: false,
      isLoading2: false,
      profesorPassword: "",
    };
  },
  mounted() {
    // service.getRoles()
    // .then(response => {
    //   this.roles = response.filter(role => role.roleName !== 'ADMINISTRADOR');
    // })
    // .catch(error => {
    //   console.error('Error al obtener los roles: ', error);
    // });
  },
  methods: {
    loginUser() {
      this.isLoading = true;
      service.getToken(this.userName, this.password).then((data) => {
        let fechaCaducidad = new Date();
        // fechaCaducidad.setTime(fechaCaducidad.getTime() + (30 * 60 * 1000)); // 30 min en milisegundos
        fechaCaducidad.setTime(fechaCaducidad.getTime() + (4 * 60 * 60 * 1000)); // 4 horas en milisegundos


        const token = "bearer " + data.response;
        Cookies.set("bearer_token", token, { expires: fechaCaducidad });

        this.isLoading = false;

        const role = data.role;
        Cookies.set('user_role', role);

        if (role === "ADMINISTRADOR") {
          this.$router.push("/gestionusuarios");
        } else {
          this.$router.push("/");
        }
      })
      .catch((error) => {
        this.isLoading = false;
        console.error('Error during login:', error);
        Swal.fire({
          icon: "error",
          title: "Error al iniciar sesión",
          text: "Por favor, revisa tus credenciales",
        });
      });
    },
    registerUser() {
      if (
        !this.form.nombre ||
        !this.form.apellidos ||
        !this.form.email ||
        !this.form.password ||
        !this.form.idRole
      ) {
        Swal.fire({
          icon: "error",
          title: "Campos incompletos",
          text: "Por favor, asegúrate de rellenar los campos obligatorios.",
        });
        return;
      }

      if (this.form.idRole === 'Alumno') {
        this.isLoading2 = true;
        this.form.idRole = 2;
        service
          .setAlumno(this.form)
          .then((response) => {
            console.log(response);

            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              },
            });
            Toast.fire({
              icon: "success",
              title: "Cuenta de alumno creada exitosamente!",
            });

            this.isLoading2 = false;
            this.clearForm();
            document.getElementById("cerrarFormCrear").click();
          })
          .catch((error) => {
            this.isLoading2 = false;
            this.form.idRole = 'Alumno';
            console.error("Error al crear el usuario: ", error);
            Swal.fire({
              icon: "error",
              title: "Error al crear el usuario",
              text: "No se pudo crear el usuario. Por favor, inténtalo de nuevo más tarde.",
            });
          });
      } else {
        this.isLoading2 = true;
        this.form.idRole = 1;
        service
          .setProfesor(this.form, this.profesorPassword)
          .then((response) => {
            console.log(response);

            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              },
            });
            Toast.fire({
              icon: "success",
              title: "Cuenta de profesor creada exitosamente!",
            });

            this.isLoading2 = false;
            this.clearForm();
            document.getElementById("cerrarFormCrear").click();
          })
          .catch((error) => {
            this.isLoading2 = false;
            this.form.idRole = 'Profesor';
            console.error("Error al crear el usuario: ", error);
            Swal.fire({
              icon: "error",
              title: "Error al crear el usuario",
              text: "No se pudo crear el usuario. Por favor, inténtalo de nuevo más tarde.",
            });
          });
      }
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
      this.profesorPassword = "";
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
