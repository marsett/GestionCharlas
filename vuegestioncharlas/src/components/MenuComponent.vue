<template>
  <nav class="navbar navbar-expand-lg navbar-custom">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        <i class="fas fa-chalkboard-teacher"></i> TAJAMAR COMANDA
      </a>
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
            <a class="nav-link active" href="#"
              ><i class="fas fa-home"></i> Home</a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#"
              ><i class="fas fa-comments"></i> Charlas</a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#"
              ><i class="fas fa-user-circle"></i> Perfil</a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#"
              ><i class="fas fa-sign-out-alt"></i> Cerrar Sesión</a
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "MenuComponent",
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>

<style>
.navbar-custom {
  background-color: #4e73df;
  border-bottom: 2px solid #2e59d9;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
}

.navbar-custom .navbar-brand {
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  transition: color 0.3s ease-in-out;
}

.navbar-custom .navbar-brand:hover {
  color: #ff9f00;
}

.navbar-custom .nav-link {
  color: white;
  font-size: 18px;
  font-weight: 500;
  transition: color 0.3s ease, transform 0.3s ease;
}

.navbar-custom .nav-link:hover {
  color: #f8f9fc;
  transform: translateY(-3px);
}

.navbar-custom .nav-item {
  margin-left: 25px;
}

.nav-link i {
  margin-right: 8px;
  font-size: 20px;
  transition: transform 0.3s ease;
}

.navbar-custom .nav-link:hover i {
  transform: scale(1.2);
}

.navbar-toggler-icon {
  background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30"%3E%3Cpath stroke="white" stroke-width="3" d="M4 7h22M4 15h22M4 23h22"%3E%3C/path%3E%3C/svg%3E');
}

@media (max-width: 768px) {
  .navbar-custom {
    background-color: #2e59d9;
  }
  .navbar-custom .navbar-toggler-icon {
    background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30"%3E%3Cpath stroke="white" stroke-width="3" d="M4 7h22M4 15h22M4 23h22"%3E%3C/path%3E%3C/svg%3E');
  }
}
</style>
