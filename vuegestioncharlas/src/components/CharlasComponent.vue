<template>
  <div>
    <div class="container" v-if="rolActual === 'ALUMNO'">
      <!-- Filtros -->
      <div class="row row-cols-1 row-cols-md-2 mt-5">
        <div class="col">
          <label for="filtroRonda" class="form-label fw-semibold h5">Filtrar por ronda:</label>
          <select id="filtroRonda" class="form-select" v-model="filtroRonda" @change="filtrarCharlas">
            <option value="0" selected>Todas las rondas</option>
            <option v-for="ronda in rondas" :key="ronda.idRonda" :value="ronda.idRonda">
              {{ `Ronda ${ronda.idRonda} - ${ronda.descripcionModulo}` }}
            </option>
          </select>
        </div>
        <div class="col">
          <label for="filtroEstado" class="form-label fw-semibold h5">Filtrar por estado:</label>
          <select id="filtroEstado" class="form-select" v-model="filtroEstado" @change="filtrarCharlas">
            <option value="">Todos los Estados</option>
            <option v-for="estado in estadosDisponibles" :key="estado" :value="estado">
              {{ estado }}
            </option>
          </select>
        </div>
      </div>

      <!-- Collapses de rondas -->
      <div class="accordion mt-4" id="accordionRondas">
        <div v-for="ronda in rondas" :key="ronda.idRonda" class="accordion-item">
          <h2 class="accordion-header" :id="`heading-${ronda.idRonda}`">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" :data-bs-target="`#collapse-${ronda.idRonda}`" aria-expanded="true" :aria-controls="`collapse-${ronda.idRonda}`">
              {{ `Ronda ${ronda.idRonda} - ${ronda.descripcionModulo}` }}
            </button>
          </h2>
          <div :id="`collapse-${ronda.idRonda}`" class="accordion-collapse collapse" :class="{ show: filtroRonda == 0 || filtroRonda == ronda.idRonda }" :aria-labelledby="`heading-${ronda.idRonda}`" data-bs-parent="#accordionRondas">
            <div class="accordion-body">
              <div class="row g-3">
                <!-- Cards de charlas dentro de cada ronda -->
                <div class="col-md-4 mb-4" v-for="charla in charlasPorRonda(ronda.idRonda)" :key="charla.idCharla">
                  <div class="card">
                    <div v-if="charla.estadoCharla" :class="estadoClass(charla.estadoCharla)" class="estado-btn">
                      {{ charla.estadoCharla }}
                    </div>
                    <img class="card-img-top" :src="charla.imagenCharla || require('../assets/banner_default.jpg')" @error="onImageError($event)" alt="Imagen de Charla" />
                    <div class="card-body">
                      <h5 class="card-title">{{ charla.titulo }}</h5>
                      <p class="card-text">{{ charla.descripcion }}</p>
                    </div>
                    <div class="card-footer">
                      <small class="text-body-secondary">
                        <button class="btn btn-primary" @click="abrirModal(charla)">Ver detalles</button>
                      </small>
                    </div>
                  </div>
                </div>
                <!-- Mensaje si no hay charlas -->
                <div v-if="charlasPorRonda(ronda.idRonda).length === 0" class="text-center text-muted">
                  No hay charlas disponibles para esta ronda.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para mostrar detalles -->
    <div v-if="mostrarModal" class="modal fade show" tabindex="-1" role="dialog" style="display: block; background: rgba(0, 0, 0, 0.5);">
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ charlaSeleccionada.titulo }}</h5>
            <button type="button" class="btn-close" aria-label="Close" @click="cerrarModal"></button>
          </div>
          <div class="modal-body">
            <img :src="charlaSeleccionada.imagenCharla || require('../assets/banner_default.jpg')" alt="Imagen de Charla" class="img-fluid mb-3" />
            <p><strong>Descripción:</strong> {{ charlaSeleccionada.descripcion }}</p>
            <p><strong>Fecha Propuesta:</strong> {{ charlaSeleccionada.fechaPropuesta }}</p>
            <p><strong>Usuario:</strong> {{ charlaSeleccionada.usuario }}</p>
            <p><strong>Curso:</strong> {{ charlaSeleccionada.nombreCurso }}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="cerrarModal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

  <script>
import CharlasService from "@/services/CharlasService";
const serviceCharlas = new CharlasService();

export default {
  name: "CharlasComponent",
  data() {
    return {
      charlas: [],
      rondas: [],
      filtroRonda: 0,
      filtroEstado: "",
      charlasFiltradas: [],
      estadosDisponibles: [],
      rolActual: "ALUMNO",
      mostrarModal: false,
      charlaSeleccionada: null
    };
  },
  methods: {
    abrirModal(charla) {
      this.charlaSeleccionada = charla;
      this.mostrarModal = true;
    },
    cerrarModal() {
      this.mostrarModal = false;
      this.charlaSeleccionada = null;
    },
    cargarRondas() {
      serviceCharlas
        .getRondas()
        .then((response) => {
          this.rondas = response;
          this.cargarCharlas();
        })
        .catch((error) => {
          console.error("Error al cargar las rondas:", error);
        });
    },
    cargarCharlas() {
      serviceCharlas
        .getCharlas()
        .then((response) => {
          this.charlas = response;
          this.charlasFiltradas = this.charlas;
          this.filtrarCharlas();
          this.estadosDisponibles = [
            ...new Set(this.charlas.map((charla) => charla.estadoCharla)),
          ];
        })
        .catch((error) => {
          console.error("Error al cargar las charlas:", error);
        });
    },
    filtrarCharlas() {
      this.charlasFiltradas = this.charlas.filter((charla) => {
        const filtroPorRonda =
          this.filtroRonda == 0 ||
          charla.idRonda === parseInt(this.filtroRonda);
        const filtroPorEstado =
          !this.filtroEstado || charla.estadoCharla === this.filtroEstado;
        return filtroPorRonda && filtroPorEstado;
      });
    },
    charlasPorRonda(idRonda) {
      return this.charlasFiltradas.filter(
        (charla) => charla.idRonda === idRonda
      );
    },
    //Para una página de detalles
    mostrarDetalles(idCharla) {
      this.$router.push({ name: 'DetallesCharla', params: { id: idCharla } });
    },
    estadoClass(estado) {
      switch (estado) {
        case "PROPUESTA":
          return "btn btn-secondary";
        case "ACEPTADA":
          return "btn btn-success";
        case "RECHAZADA":
          return "btn btn-danger";
        default:
          return "btn btn-info";
      }
    },
    onImageError(event) {
      event.target.src = require("../assets/banner_default.jpg");
    },
  },
  mounted() {
    this.cargarRondas();
  },
};
</script>  

<style scoped>
.card-text {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-clamp: 3; /* Líneas que se van a mostrar */
  -webkit-line-clamp: 3; /* Número de líneas visibles */
  -webkit-box-orient: vertical;
  padding: 5px 0px 5px 0px; 
}
.card-img-top {
  width: 100%;
  max-height: 120px;
  object-fit: cover;
}
.container {
  margin-top: 20px;
}
.card-body {
  height: 150px;
}

.card-header {
  font-weight: bold;
  background-color: #f8f9fa;
}

.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  margin-bottom: 20px;
  margin-top: 10px;
}

.card:hover {
  transform: translateY(-5px);
}

.estado-btn {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 5px;
  color: white;
  font-weight: bold;
  border-radius: 5px;
  z-index: 10;
  pointer-events: none;
}
</style>
