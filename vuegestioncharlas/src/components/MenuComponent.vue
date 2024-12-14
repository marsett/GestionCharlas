<template>
  <nav class="navbar navbar-expand-lg navbar-custom">
    <div class="container-fluid">
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link 
              class="nav-link" 
              to="/" 
              :class="{ selected: isSelected('/') }" 
              @click="setSelected('/')"
            >
              <i class="fas fa-home"></i> Home
            </router-link>
          </li>
          <li class="nav-item">
            <router-link 
              class="nav-link" 
              to="/charlas" 
              :class="{ selected: isSelected('/charlas') }" 
              @click="setSelected('/charlas')"
            >
              <i class="fas fa-comments"></i> Charlas
            </router-link>
          </li>
          <li class="nav-item">
            <router-link 
              class="nav-link" 
              to="/perfilalumno" 
              :class="{ selected: isSelected('/perfilalumno') }" 
              @click="setSelected('/perfilalumno')"
            >
              <i class="fas fa-user-circle"></i> Perfil
            </router-link>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" @click.prevent="logout">
              <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import Cookies from 'cookies-js';
import Swal from 'sweetalert2';

export default {
  name: "MenuComponent",
  data() {
    return {
      selectedRoute: '/',
    };
  },
  methods: {
    setSelected(route) {
      this.selectedRoute = route;
    },
    isSelected(route) {
      return this.selectedRoute === route;
    },
    logout() {
      Swal.fire({
        title: "¿Quieres cerrar la sesión?",
        text: "Una vez cerrada, para volver a acceder al contenido, necesitarás iniciar sesión de nuevo.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Cerrar sesión",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          Cookies.expire('bearer_token');
          this.$router.push('/login');
        }
      });
    },
  },
};
</script>

<style>
.navbar-custom {
  background-color: #333333; /* Fondo gris oscuro */
  border-bottom: 2px solid #444444; /* Gris más claro */
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);
  transition: background-color 0.3s ease-in-out;
}

.navbar-custom .navbar-brand {
  font-size: 24px;
  font-weight: bold;
  color: #B0B0B0; /* Gris claro */
}

.navbar-custom .navbar-brand:hover {
  color: #4CAF50; /* Verde suave */
  transform: none; /* Sin transformación al hacer hover */
}

.navbar-custom .nav-link {
  color: #B0B0B0; /* Gris claro */
  font-size: 18px;
  font-weight: 500;
  padding: 10px 15px;
  border-radius: 5px;
  transition: color 0.3s ease, background-color 0.3s ease;
}

.navbar-custom .nav-link:hover {
  color: #FFFFFF; /* Blanco */
  background-color: rgba(76, 175, 80, 0.2); /* Verde suave de fondo */
  transform: none; /* Sin transformación */
  box-shadow: none; /* Sin sombra */
}

/* Animación de selección */
.navbar-custom .nav-link.selected {
  background-color: rgba(76, 175, 80, 0.4); /* Fondo verde suave */
  color: #FFFFFF; /* Blanco */
  transform: none; /* Sin transformación */
  box-shadow: none; /* Sin sombra */
}

.navbar-custom .nav-item {
  margin-left: 25px;
  opacity: 1; /* Se elimina la animación */
  animation: none; /* Sin animación */
}

.nav-link i {
  margin-right: 8px;
  font-size: 20px;
  transition: transform 0.3s ease, color 0.3s ease;
}

.navbar-custom .nav-link:hover i {
  transform: none; /* Sin transformación en icono */
  color: #4CAF50; /* Verde suave */
}

.navbar-toggler-icon {
  background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30"%3E%3Cpath stroke="white" stroke-width="3" d="M4 7h22M4 15h22M4 23h22"%3E%3C/path%3E%3C/svg%3E');
  transition: transform 0.3s ease;
}

.navbar-toggler-icon:hover {
  transform: rotate(90deg);
}

@media (max-width: 768px) {
  .navbar-custom {
    background-color: #444444; /* Fondo más claro para pantallas pequeñas */
  }
  .navbar-custom .navbar-toggler-icon {
    background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30"%3E%3Cpath stroke="white" stroke-width="3" d="M4 7h22M4 15h22M4 23h22"%3E%3C/path%3E%3C/svg%3E');
  }
}
</style>
