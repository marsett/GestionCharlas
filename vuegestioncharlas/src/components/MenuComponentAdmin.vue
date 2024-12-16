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
              to="/gestionusuarios"
              :class="{ selected: isSelected('/gestionusuarios') }"
              @click="setSelected('/gestionusuarios')"
            >
              <i class="fas fa-users"></i> Gestión de Usuarios
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              to="/gestionprofesores"
              :class="{ selected: isSelected('/gestionprofesores') }"
              @click="setSelected('/gestionprofesores')"
            >
              <i class="fas fa-chalkboard-teacher"></i> Gestión de Profesores
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
  name: "MenuComponentAdmin",
  data() {
    return {
      selectedRoute: '/gestionusuarios',
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
