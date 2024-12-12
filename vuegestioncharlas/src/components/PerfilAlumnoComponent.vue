<template>
  <div class="container mt-5">
    <div class="card shadow-lg p-4 rounded" style="width: 100%; max-width: 1100px;">
      <div class="row text-center text-md-start">
        <div class="col-12 col-md-3 mb-4 mb-md-0">
          <img
            :src="'https://docomomoiberico.com/wp-content/uploads/2010/05/E_MA_A31_01-copia.jpg'"
            alt="Foto de perfil"
            class="profile-image img-fluid rounded-circle border-primary mb-3"
            style="width: 150px; height: 150px; object-fit: cover;"
          />
        </div>
        
        <div class="col-12 col-md-9">
          <h4 class="font-weight-bold">Mario Jiménez Marset</h4>
          <p class="text-muted">Alumno</p>

          <div class="list-group">
            <div class="list-group-item">
              <strong>Nombre:</strong> Mario
            </div>
            <div class="list-group-item">
              <strong>Apellidos:</strong> Jiménez Marset
            </div>
            <div class="list-group-item">
              <strong>Email:</strong> mario.jimenezmarset@tajamar365.com
            </div>
            <div class="list-group-item">
              <strong>Contraseña:</strong> ************
            </div>
          </div>
        </div>
      </div>

      <div class="d-flex gap-3 mt-4 justify-content-center justify-content-md-start">
        <button class="btn btn-primary">Editar Perfil</button>
        <router-link class="nav-link" to="/charlasalumno">
          <button class="btn btn-primary">Mis Charlas</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PerfilAlumnoComponent",
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
