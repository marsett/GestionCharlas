<template>
  <div class="login-background">
    <div class="login-container">
      <div class="card shadow-lg">
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
            ¿No tienes cuenta? <a href="#">Regístrate aquí</a>
          </p>
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
      };
    },
    methods: {
      loginUser() {
        service.getToken(this.userName, this.password)
          .then(response => {
            let fechaCaducidad = new Date();
            fechaCaducidad.setTime(fechaCaducidad.getTime() + (2 * 60 * 60 * 1000)); // 2 horas en milisegundos

            let token = 'bearer ' + response;
            Cookies.set('bearer_token', token, { expires: fechaCaducidad });

            //& Emitimos el evento de actualización del estado de inicio de sesión
            //& this.$emit('updateLoginStatus', true);

            this.$router.push('/');
          })
          .catch(error => {
            console.error('Error al obtener el token:', error);
            alert('Usuario o contraseña incorrectos.'); //? Sweet alert 
          });
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
  }
</style>
