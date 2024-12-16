<template>
    <div class="container">
        <h2>Todas las charlas</h2>
        <ul>
            <li v-for="charla in charlas" :key="charla.id">
                {{ charla.titulo }} - {{ charla.descripcion }}
            </li>
        </ul>
    </div>
</template>

<script>
import CharlasService from '@/services/CharlasService';

export default {
    name: 'CharlasComponent',
    data() {
        return {
            charlas: [], // Almacena las charlas
        };
    },
    methods: {
        cargarCharlas() {
            CharlasService.getTodasLasCharlas()
                .then(response => {
                    console.log('Charlas cargadas:', response);
                    this.charlas = response; // Asigna las charlas obtenidas
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
