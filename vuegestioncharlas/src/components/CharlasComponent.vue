<template>
    <div class="container">
        <h2 class="my-4">Todas las charlas</h2>
        <div class="row">
            <div v-for="charla in charlas" :key="charla.id" class="col-md-4 mb-4">
                <div class="card h-100">
                    <div class="card-header">
                        {{ charla.titulo }}
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">{{ charla.titulo }}</h5>
                        <p class="card-text">{{ charla.descripcion }}</p>
                        <a href="#" class="btn btn-primary">Ver más</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CharlasService from '@/services/CharlasService';
export default {
    name: 'CharlasComponent',
    data() {
        return {
            charlas: [],
        };
    },
    methods: {
        cargarCharlas() {
            CharlasService.getCharlas()  
                .then(response => {
                    console.log('Charlas cargadas:', response);
                    this.charlas = response;
                })
                .catch(error => {
                    console.error('Error al cargar las charlas:', error);
                });
        },
    },
    mounted() {
        this.cargarCharlas();
    },
};
</script>

<style scoped>
.card-header {
    font-weight: bold;
    background-color: #f8f9fa;
}

.card {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
}

.card:hover {
    transform: translateY(-5px);
}
</style>
