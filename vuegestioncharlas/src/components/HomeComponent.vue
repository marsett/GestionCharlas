<template>
  <div class="container my-3 mt-md-4" v-if="role == 2">
    <h1>Hola, {{ nombre }}</h1>

    <div class="row row-cols-md-2 my-4">
      <!-- Card para ronda abierta (no activa) -->
      <div class="col mb-3">
        <div :class="{'card': true, 'inactive-card': !isRondaAbierta, 'active-card': isRondaAbierta}">
          <div class="card-body text-center">
            <h5 class="card-title">📢 Ronda Abierta</h5>
            <p class="card-text">
              {{ isRondaAbierta ? 'Actualmente hay una ronda abierta para subir charlas. ¡Aprovecha la oportunidad de compartir tus ideas!' : 'No hay rondas abiertas para subir charlas.' }}
            </p>
            <router-link 
              to="/charlas"
              class="btn"
              :class="isRondaAbierta ? 'btn-primary' : 'btn-secondary'"
              :disabled="!isRondaAbierta"
            >Subir charla</router-link>
          </div>
        </div>
      </div>
    
      <!-- Card para votación activa (activa o no activa) -->
      <div class="col mb-3">
        <div :class="{'card': true, 'inactive-card': !isVotacionActiva, 'active-card': isVotacionActiva}">
          <div class="card-body text-center">
            <h5 class="card-title">🔔 Votación Activa</h5>
            <p class="card-text">
              {{ isVotacionActiva ? 'Actualmente hay una votación activa para elegir las próximas charlas. ¡Haz que tu voz cuente!' : 'No hay votaciones activas en este momento.' }}
            </p>
            <router-link 
              to="/charlas"
              class="btn"
              :class="isVotacionActiva ? 'btn-primary' : 'btn-secondary'"
              :disabled="!isVotacionActiva"
            >Ir a Votar</router-link>
          </div>
        </div>
      </div>
    </div>

    <div class="home">
      <div class="my-5">        
        <!-- Calendario -->
        <FullCalendar :options="calendarOptions" />
      </div>
    </div>
  </div>
</template>

<script>
// import FullCalendar from '@fullcalendar/vue3/dist/FullCalendar';

import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es'; 
import Swal from 'sweetalert2';
import PerfilService from '@/services/PerfilService';

const service = new PerfilService();

export default {
  name: "HomeComponent",
  components: {
    FullCalendar,
  },
  data() {
    return {
      calendarOptions: {
        plugins: [ dayGridPlugin, interactionPlugin ],
        initialView: 'dayGridMonth',
        dateClick: this.handleDateClick,
        locale: esLocale, 
        events: [
          { title: 'Navidad', date: '2024-12-25' },
          { title: 'Noche vieja', date: '2024-12-31' }
        ]
      },
      nombre: "",
      role: "",
      isRondaAbierta: false, 
      isVotacionActiva: false
    };
  },
  mounted() {
    service.getUsuarioPerfil()
    .then(response => {
      console.log(response);
      this.nombre = response.usuario.nombre;
      this.role = response.usuario.idRole;
    })
    .catch(error => {
      console.error('Error al obtener los datos de usuario:', error);
    });
  },
  methods: {
    handleDateClick(info) {
      Swal.fire(`Has hecho clic en: ${info.dateStr}`);
    },
  },
}
</script>

<style scoped>
  /* Estilo para la card activa (cuando está disponible) */
  .active-card {
    transition: box-shadow 0.3s ease-in-out;
  }

  .active-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Sombra cuando se pasa el ratón */
  }

  /* Estilo para la card inactiva (cuando no está disponible) */
  .inactive-card {
    background-color: #f8f9fa; /* Fondo suave, más apagado */
    opacity: 0.6; /* Hacerla más opaca */
    pointer-events: none; /* Desactiva los clics en la card */
  }

  .inactive-card .card-body .btn {
    background-color: #6c757d; /* Botón deshabilitado */
    border-color: #6c757d;
    pointer-events: none; /* Desactivar el botón */
  }

  td:hover{
    cursor: pointer;
  }
</style>