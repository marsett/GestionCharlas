<template>
    <div>

        <div class="container" v-if="rolActual == 'ALUMNO'">  
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

        <div class="container mt-5" v-if="rolActual === 'PROFESOR'">
            <h2 class="text-center my-5">Crear Nueva Ronda</h2>
            <form @submit.prevent="crearRonda">
                <!-- Primera fila -->
                <div class="row row-cols-1 row-cols-md-2 gy-5">
                    <!-- Fecha de Presentación -->
                    <div class="col">
                        <label for="fechaPresentacion" class="form-label fw-semibold h5 mb-3">Fecha de Presentación:</label>
                        <input
                        type="datetime-local"
                        id="fechaPresentacion"
                        v-model="form.fechaPresentacion"
                        class="form-control mb-1"
                        required
                        />
                        <small class="text-danger"><b>Nota:</b> Es la fecha en la que debe realizarse la charla.</small>
                    </div>
                    <!-- Fecha de Cierre -->
                    <div class="col">
                        <label for="fechaCierre" class="form-label fw-semibold h5 mb-3">Fecha de Cierre:</label>
                        <input
                        type="datetime-local"
                        id="fechaCierre"
                        v-model="form.fechaCierre"
                        class="form-control mb-1"
                        required
                        />
                        <small class="text-danger"><b>Nota:</b> Es la última fecha para proponer charlas.</small>
                    </div>
                    <!-- Fecha Límite de Votación -->
                    <div class="col">
                        <label for="fechaLimiteVotacion" class="form-label fw-semibold h5 mb-3">Fecha Límite de Votación:</label>
                        <input
                        type="datetime-local"
                        id="fechaLimiteVotacion"
                        v-model="form.fechaLimiteVotacion"
                        class="form-control mb-1"
                        required
                        />
                        <small class="text-danger"><b>Nota:</b> Es el período para votar, entre la fecha de cierre y esta fecha.</small>
                    </div>
                    <!-- Duración -->
                    <div class="col">
                        <label for="duracion" class="form-label fw-semibold h5 mb-3">Duración (minutos):</label>
                        <input
                        type="number"
                        id="duracion"
                        v-model="form.duracion"
                        class="form-control"
                        required
                        min="1"
                        />
                    </div>
                    <!-- Descripción del Módulo -->
                    <div class="col-12 w-100">
                        <label for="descripcionModulo" class="form-label fw-semibold h5 mb-3">Descripción del Módulo:</label>
                        <input
                        type="text"
                        id="descripcionModulo"
                        v-model="form.descripcionModulo"
                        class="form-control"
                        required
                        maxlength="255"
                        />
                    </div>
                </div>
                <!-- Botón -->
                <div class="text-center mt-4">
                <button type="submit" class="btn btn-primary" :disabled="isLoading">
                    <span
                    v-if="isLoading"
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                    ></span>
                    Crear Ronda
                </button>
                </div>
            </form>
        </div>
    </div>
</template>
  
<script>
import Cookies from "cookies-js";
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
            estadosDisponibles: [],
            rolActual: 'ALUMNO',
            form: {
                fechaPresentacion: '',
                fechaCierre: '',
                duracion: 0,
                descripcionModulo: '',
                fechaLimiteVotacion: ''
            },
            isLoading: false
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
        },
        crearRonda() {
            this.isLoading = true;
            // Simulación de envío del formulario
            setTimeout(() => {
                alert("Ronda creada exitosamente!");
                this.isLoading = false;
            }, 1000);
            
            // serviceCharlas.setRonda(this.form)
            // .then(response => {
            //     console.log('Charlas cargadas:', response);
            //     alert('Ronda creada exitosamente!');
            //     this.form = {
            //         fechaPresentacion: '',
            //         fechaCierre: '',
            //         duracion: 0,
            //         descripcionModulo: '',
            //         fechaLimiteVotacion: ''
            //     };
            //     this.isLoading = false;
            // })
            // .catch(error => {
            //     this.isLoading = false;
            //     console.error('Error al crear la ronda profesor:', error);
            // });
        }
    },
    mounted() {
        this.cargarRondas();
        this.rolActual = Cookies.get('user_role');
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
