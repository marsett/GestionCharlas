<template>
    <div class="container">  
        <div class="row row-cols-1 row-cols-md-2 mt-5">
            <div class="col">
                <label for="filtroRonda" class="form-label fw-semibold h5">Filtrar por ronda:</label>
                <select
                    id="filtroRonda"
                    class="form-select"
                    v-model="filtroRonda"
                    @change="filtrarCharlas"
                >
                    <option value="0" selected>Todas las rondas</option>
                    <option
                    v-for="ronda in rondas"
                    :key="ronda.idRonda"
                    :value="ronda.idRonda"
                    >
                    {{ `Ronda ${ronda.idRonda} - ${ronda.descripcionModulo}` }}
                    </option>
                </select>
            </div>
            <div class="col">
                <label for="filtroEstado" class="form-label fw-semibold h5">Filtrar por estado:</label>
                <select 
                    id="filtroEstado" 
                    class="form-select" 
                    v-model="filtroEstado" 
                    @change="filtrarCharlas">
                    <option value="">Todos los Estados</option>
                    <option v-for="estado in estadosDisponibles" :key="estado" :value="estado">
                    {{ estado }}
                    </option>
                </select>
            </div>
        </div>

        <!-- Lista de Charlas -->
        <div class="row mt-4">
            <div v-if="charlasFiltradas.length == 0" class="col-12 text-center mt-4">
                <div class="alert alert-warning p-5">
                    <h4 class="mt-3">No hay charlas disponibles</h4>
                    <p class="text-muted">Intenta ajustar los filtros o vuelve más tarde.</p>
                </div>
            </div>

            <div class="col-md-4 mb-4" v-for="charla in charlasFiltradas" :key="charla.idCharla">
                <div class="card h-100">
                <div v-if="charla.estadoCharla" :class="estadoClass(charla.estadoCharla)" class="estado-btn">
                    {{ charla.estadoCharla }}
                </div>
                <img 
                    class="card-img-top" 
                    :src="charla.imagenCharla || require('../assets/banner_default.jpg')" 
                    @error="onImageError($event)" 
                    alt="Imagen de Charla"
                >

                <div class="card-body">
                    <h5 class="card-title">{{ charla.titulo }}</h5>
                    <p class="card-text">{{ charla.descripcion }}</p>
                    <button class="btn btn-primary" @click="mostrarDetalles(charla.idCharla)">Ver detalles</button>
                </div>
                <div v-if="charla.mostrarDetalles" class="card-footer">
                    <p><strong>Fecha Propuesta:</strong> {{ charla.fechaPropuesta }}</p>
                    <p><strong>Usuario:</strong> {{ charla.usuario }}</p>
                    <p><strong>Curso:</strong> {{ charla.nombreCurso }}</p>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>
  

<script>
import CharlasService from '@/services/CharlasService';
const serviceCharlas = new CharlasService();
export default {
    name: 'CharlasComponent',
    data() {
        return {
            charlas: [],
            rondas: [], 
            filtroRonda: 0, 
            filtroEstado: "",
            charlasFiltradas: [],
            estadosDisponibles: []
        };
    },
    methods: {
        cargarRondas(){
            serviceCharlas.getRondas()
                .then(response => {
                    this.rondas = response;
                    this.cargarCharlas();
                })
                .catch(error => {
                    console.error('Error al cargar las charlas:', error);
                });

        },
        cargarCharlas() {
            serviceCharlas.getCharlas()
                .then(response => {
                    console.log('Charlas cargadas:', response);
                    this.charlas = response;
                    this.charlasFiltradas = this.charlas;
                    this.filtrarCharlas();
                    this.estadosDisponibles = [...new Set(this.charlas.map(charla => charla.estadoCharla))]; // Extraer estados únicos
                })
                .catch(error => {
                    console.error('Error al cargar las charlas:', error);
                });
        },
        mostrarDetalles(idCharla) {
            const charla = this.charlas.find(c => c.idCharla === idCharla);
            if (charla) {
                charla.mostrarDetalles = !charla.mostrarDetalles; // Alterna la visibilidad de los detalles
            }
        },
        estadoClass(estado) {
            switch (estado) {
                case 'PROPUESTA':
                    return 'btn btn-secondary';
                case 'ACEPTADA':
                    return 'btn btn-success';
                case 'RECHAZADA':
                    return 'btn btn-danger';
                default:
                    return 'btn btn-info';
            }
        },
        filtrarCharlas() {
            this.charlasFiltradas = this.charlas.filter((charla) => {
                const filtroPorRonda = this.filtroRonda == 0 || charla.idRonda === parseInt(this.filtroRonda);
                const filtroPorEstado = !this.filtroEstado || charla.estadoCharla === this.filtroEstado;
                return filtroPorRonda && filtroPorEstado;
            });
        },
        onImageError(event) {
            // Cambia la fuente de la imagen al valor predeterminado
            event.target.src = require('../assets/banner_default.jpg');
        }
    },
    mounted() {
        this.cargarRondas();
    },
    watch: {
        filtroRonda: "filtrarCharlas",
        filtroEstado: "filtrarCharlas",
    },
};
</script>

<style scoped>
.container {
    margin-top: 20px;
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
