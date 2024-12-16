<template>
    <div class="container">
      <div v-for="(charlas, idRonda) in rondas" :key="idRonda" class="card mb-3">
        <div class="card-header">
          Ronda {{ idRonda }}
        </div>
        <div class="card-body">
          <div v-for="charla in charlas" :key="charla.idCharla" class="card mb-2">
            <div class="card-body">
              <h5 class="card-title">{{ charla.titulo }}</h5>
              <p class="card-text">{{ charla.descripcion }}</p>
              <a :href="'/detalles/' + charla.idCharla" class="btn btn-primary">Ver detalles</a>
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
        rondas: {}, // Datos agrupados por ronda
        rondasActivas: [1, 2, 3], // IDs de las rondas activas (puedes obtenerlas desde otra API o configurarlas)
      };
    },
    methods: {
      async cargarCharlas() {
        try {
          const charlas = await CharlasService.getCharlasPorRondasActivas(this.rondasActivas);
          // Agrupar charlas por idRonda
          this.rondas = charlas.reduce((acc, charla) => {
            if (!acc[charla.idRonda]) acc[charla.idRonda] = [];
            acc[charla.idRonda].push(charla);
            return acc;
          }, {});
        } catch (error) {
          console.error('Error al cargar las charlas por rondas activas:', error);
        }
      },
    },
    mounted() {
      this.cargarCharlas();
    },
  };
  </script>
  