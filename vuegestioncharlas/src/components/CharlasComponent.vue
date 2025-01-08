<template>
    <div class="container">
        <h2>Todas las charlas</h2>
        <div class="row">
            <div class="col-md-4" v-for="charla in charlas" :key="charla.id">
                <div class="card">
                    <div v-if="charla.estadoCharla" :class="estadoClass(charla.estadoCharla)" class="estado-btn">
                        {{ charla.estadoCharla }}
                    </div>
                    <img class="card-img-top" src="../assets/banner_default.jpg" alt="Card image cap">
                    <div class="card-body">
                        <h5 class="card-title">{{ charla.titulo }}</h5>
                        <p class="card-text">{{ charla.descripcion }}</p>
                        <button class="btn btn-primary" @click="mostrarDetalles(charla.idCharla)">Ver detalles</button>
                        <div v-if="charla.mostrarDetalles" class="card-footer">
                            <p><strong>Fecha Propuesta:</strong> {{ charla.fechaPropuesta }}</p>
                            <p><strong>Usuario:</strong> {{ charla.usuario }}</p>
                            <p><strong>Curso:</strong> {{ charla.nombreCurso }}</p>
                        </div>
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
        };
    },
    methods: {
        cargarCharlas() {
            serviceCharlas.getCharlas()
                .then(response => {
                    console.log('Charlas cargadas:', response);
                    this.charlas = response;
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
        }
    },
    mounted() {
        this.cargarCharlas();
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
