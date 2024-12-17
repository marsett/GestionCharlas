<template>
  <div class="container mt-5">
    <div v-if="charlas.length === 0" class="card text-center shadow-sm">
      <div class="card-body">
        <h5 class="card-title text-primary">Sin charlas disponibles</h5>
        <p class="card-text">
          Actualmente no tienes charlas registradas. Cuando se añadan charlas, podrás visualizarlas aquí.
        </p>
        <button @click="volverPaginaAnterior" class="btn btn-secondary mt-3">
          Volver a la página anterior
        </button>
      </div>
    </div>

    <div v-else>
      <div v-for="charla in charlas" :key="charla.charla.idCharla" class="card mb-4">
        <div class="card-header d-flex justify-content-between">
          <h5>{{ charla.charla.titulo }}</h5>
          <small class="text-muted">Fecha propuesta: {{ formatDate(charla.charla.fechaPropuesta) }}</small>
        </div>
        <div class="card-body">
          <p><strong>Estado:</strong> {{ charla.charla.estadoCharla }}</p>
          <p><strong>Curso:</strong> {{ charla.charla.nombreCurso }}</p>
          <p><strong>Duración:</strong> {{ charla.charla.tiempo }} minutos</p>

          <button v-if="!charla.showDetails" @click="charla.showDetails = true" class="btn btn-primary mt-3">
            Ver Detalles
          </button>

          <div v-if="charla.showDetails">
            <p><strong>Descripción:</strong> {{ charla.charla.descripcion }}</p>

            <h6>Recursos:</h6>
            <ul>
              <li v-for="recurso in charla.recursos" :key="recurso.idRecurso">
                <a :href="recurso.url" target="_blank">{{ recurso.nombre }}</a>: {{ recurso.descripcion }}
              </li>
            </ul>

            <h6>Comentarios:</h6>
            <div v-for="comentario in charla.comentarios" :key="comentario.idComentario" class="mb-2">
              <p><strong>{{ comentario.usuario }}:</strong> {{ comentario.contenido }}</p>
              <small class="text-muted">{{ formatDate(comentario.fecha) }}</small>
            </div>

            <button @click="charla.showDetails = false" class="btn btn-secondary mt-3">
              Ocultar Detalles
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PerfilService from "@/services/PerfilService";

export default {
  name: "CharlasAlumnoComponent",
  data() {
    return {
      charlas: [],
    };
  },
  methods: {
    formatDate(date) {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
      return new Date(date).toLocaleDateString("es-ES", options);
    },

    async cargarCharlas() {
      const perfilService = new PerfilService();
      try {
        const data = await perfilService.getCharlasUsuario();
        this.charlas = data;
      } catch (error) {
        console.error("Error al cargar las charlas:", error);
        alert("No se pudo cargar las charlas.");
      }
    },
    volverPaginaAnterior() {
      this.$router.go(-1);
    },
  },
  created() {
    this.cargarCharlas();
  },
};
</script>

<style scoped>
.container {
  padding: 20px;
}

.card {
  border-radius: 10px;
  border: none;
  background-color: #f9f9f9;
}

.card-title {
  font-size: 1.25rem;
}

.card-text {
  font-size: 1rem;
  color: #6c757d;
}

.card-header {
  background-color: #f1f1f1;
  border-bottom: 1px solid #e0e0e0;
}

.btn {
  font-size: 0.9rem;
}
</style>
