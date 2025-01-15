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
      <div class="chats">
        <div v-for="charla in charlas" :key="charla.charla.idCharla" class="chat-card">
          <div class="chat-image">
            <img :src="charla.charla.imagen" alt="Imagen charla" />
          </div>
          <div class="chat-info">
            <div class="chat-details">
              <h5 class="chat-title">{{ charla.charla.titulo }}</h5>
              <p class="chat-description">{{ charla.charla.descripcion }}</p>
              <button 
                @click="charla.showDetails = !charla.showDetails" 
                class="btn btn-round">
                +
              </button>
            </div>
            <!-- Detalles adicionales debajo de la charla -->
            <div v-if="charla.showDetails" class="additional-details">
              <p><strong>Fecha Propuesta:</strong> {{ charla.charla.fechaPropuesta }}</p>
              <p><strong>Usuario:</strong> {{ charla.charla.usuario }}</p>
              <p><strong>Curso:</strong> {{ charla.charla.nombreCurso }}</p>
            </div>
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

.chats {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 10px;
  margin-top: 20px;
}

.chat-card {
  display: flex;
  flex-direction: column;
  background-color: #a7a2a2;
  padding: 20px;
  width: 320px;
  min-height: 320px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  overflow: hidden;
}

.chat-card:hover {
  transform: translateY(-10px);
}

.chat-image {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #c0c0c0;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
  max-height: 150px;
  overflow: hidden;
}

.chat-image img {
  max-width: 100%;
  height: auto;
}

.chat-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-grow: 1;
}

.chat-title {
  font-size: 20px;
  font-weight: bold;
  color: white;
  margin-bottom: 10px;
}

.chat-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: #757272;
  padding: 10px;
  border-radius: 8px;
  margin-top: 10px;
  width: 100%;
  flex-grow: 1;
}

.chat-description {
  font-size: 16px;
  color: white;
  white-space: normal;
  word-wrap: break-word;
}

.btn-round {
  align-self: flex-end;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background-color: #83a2c4;
  color: white;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s ease-in-out;
}

.btn-round:hover {
  background-color: #0056b3;
}

/* Estilos para los detalles adicionales */
.additional-details {
  background-color: #e0e0e0;
  padding: 10px;
  margin-top: 10px;
  border-radius: 8px;
}

</style>
