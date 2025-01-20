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
            <img :src="charla.charla.imagen || 'https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-1.jpg'" alt="Imagen charla" />
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
  padding: 30px;
}

.chats {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 20px;
  margin-top: -30px;
}

.chat-card {
  display: flex;
  flex-direction: column;
  background-color: #cfcece; 
  padding: 15px;
  width: 100%;
  max-width: 300px; 
  min-height: 250px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  overflow: hidden;
}

.chat-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.chat-image {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  padding: 8px;
  border-radius: 8px;
  margin-bottom: 12px;
  max-height: 120px;
  overflow: hidden;
}

.chat-image img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.chat-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-grow: 1;
}

.chat-title {
  font-size: 18px;
  font-weight: bold;
  color: #333; 
  margin-bottom: 8px;
  text-align: center;
}

.chat-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: #afaeae; 
  padding: 12px;
  border-radius: 8px;
  margin-top: 12px;
  width: 100%;
}

.chat-description {
  font-size: 13px;
  color: #666; 
  white-space: normal;
  word-wrap: break-word;
  margin-bottom: 12px;
}

.btn-round {
  align-self: flex-end;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: none;
  background-color: #555; 
  color: white;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out, transform 0.2s ease-in-out;
}

.btn-round:hover {
  background-color: #333; 
  transform: scale(1.1);
}

.additional-details {
  background-color: #a1a0a0; 
  padding: 10px;
  margin-top: 12px;
  border-radius: 8px;
  font-size: 12px;
  color: #e3e3e3; 
}

@media (max-width: 768px) {
  .chat-card {
    width: 100%;
  }

  .chat-title {
    font-size: 16px;
  }

  .chat-description {
    font-size: 12px;
  }

  .btn-round {
    font-size: 18px;
  }
}

@media (max-width: 576px) {
  .chat-card {
    padding: 12px;
    min-height: 230px;
  }

  .chat-title {
    font-size: 14px;
  }

  .chat-description {
    font-size: 11px;
  }

  .btn-round {
    font-size: 16px;
  }
}

</style>
