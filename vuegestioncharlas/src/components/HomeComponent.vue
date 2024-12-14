<template>
  <div class="container my-3 mt-md-4" v-if="role == 2">
    <h1>Hola, {{ nombre }} !!</h1>

    <div class="row row-cols-1 row-cols-md-2 my-4">
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

    <div class="mb-3">
      <!-- Guía de colores -->
      <div class="mt-4 pt-0 mt-md-5 pt-md-3">
        <div class="row">
          <!-- Ronda Abierta -->
          <div class="col-md-auto">
            <div class="d-flex align-items-center">
              <div class="color-box" style="background-color: blue;"></div>
              <span class="ms-2">Ronda abierta</span>
            </div>
          </div>
          <!-- Votación Activa -->
          <div class="col-md-auto">
            <div class="d-flex align-items-center">
              <div class="color-box" style="background-color: green;"></div>
              <span class="ms-2">Votación activa</span>
            </div>
          </div>
          <!-- Votación Terminada -->
          <div class="col-md-auto">
            <div class="d-flex align-items-center">
              <div class="color-box" style="background-color: purple;"></div>
              <span class="ms-2">Presentación</span>
            </div>
          </div>
        </div>
        <p class="text-secondary small mt-2"><b>Nota:</b> Lo que aparece en el calendario es el titulo de la ronda.</p>
      </div>

      <!-- Calendario -->
      <div class="mt-3">
        <!-- Contenedor con scroll horizontal -->
        <div class="calendar-wrapper">
          <FullCalendar :options="calendarOptions" />
        </div>
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
import CharlasService from '@/services/CharlasService';

const servicePerf = new PerfilService();
const serviceChar = new CharlasService();

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
        events: []
      },
      nombre: "",
      role: "",
      isRondaAbierta: false, 
      isVotacionActiva: false,
      rondas: [],
    };
  },
  mounted() {
    servicePerf.getUsuarioPerfil()
    .then(response => {
      this.nombre = response.usuario.nombre;
      this.role = response.usuario.idRole;
    })
    .catch(error => {
      console.error('Error al obtener los datos de usuario:', error);
    });

    this.evaluarRondas();
  },
  methods: {
    handleDateClick(info) {
      const clickedDate = info.date;

      // Formatear la fecha de forma legible
      const formattedDate = clickedDate.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      console.log('Eventos:', this.calendarOptions.events);  // Verifica los eventos disponibles

      // Filtrar eventos que coinciden con la fecha seleccionada
      let eventList = "";
      if (this.calendarOptions.events.length > 0) {
        const eventsOnSelectedDate = this.calendarOptions.events.filter((event) => {
          const eventStartDate = new Date(event.start || event.date);  // Fecha de inicio
          const eventEndDate = event.end ? new Date(event.end) : eventStartDate;  // Fecha de fin, si existe

          // Asegurarse de comparar solo el día, mes y año (sin horas)
          const startDate = new Date(eventStartDate.setHours(0, 0, 0, 0));
          const endDate = new Date(eventEndDate.setHours(0, 0, 0, 0));
          const selectedDate = new Date(clickedDate.setHours(0, 0, 0, 0));  // Fecha seleccionada sin hora

          // Comprobar si la fecha seleccionada está dentro del rango de fechas del evento
          return selectedDate >= startDate && selectedDate <= endDate;
        });

        if (eventsOnSelectedDate.length > 0) {
          eventList = eventsOnSelectedDate.map((event, index) => {
            let eventType = "";

            // Determinar el tipo de evento según el color
            switch (event.color) {
              case 'blue':
                eventType = "Ronda Abierta";
                break;
              case 'green':
                eventType = "Votación Activa";
                break;
              case 'purple':
                eventType = "Presentación";
                break;
              default:
                eventType = "Evento desconocido";
            }

            // Retorna el evento con el título y tipo
            return `<b>${index + 1}. ${eventType}:</b> ${event.title}`;
          }).join("<br>");
        } else {
          eventList = "No hay eventos para esta fecha.";
        }
      } else {
        eventList = "No hay eventos para esta fecha.";
      }

      // Mostrar la fecha clickeada y los eventos en el SweetAlert
      Swal.fire({
        title: `${formattedDate}`,  // Título con fecha formateada
        html: `${eventList}`,
        icon: 'info',
      });
    },


    evaluarRondas(){
      serviceChar.getRondas()
      .then(response => {
        this.rondas = response;
        const ahora = new Date();

        let isRondaAbierta = false;
        let isVotacionActiva = false;
        const events = []; // Para llenar el calendario

        this.rondas.forEach(ronda => {
          const fechaCierre = new Date(ronda.fechaCierre);
          const fechaLimiteVotacion = new Date(ronda.fechaLimiteVotacion);
          const fechaPresentacion = new Date(ronda.fechaPresentacion);

          // Comprobar si la ronda está abierta para solicitar charlas
          if (ahora <= fechaCierre) {
            isRondaAbierta = true;

            events.push({
              title: `${ronda.descripcionModulo}`,
              start: ahora.toISOString().split('T')[0],
              end: fechaCierre.toISOString().split('T')[0],
              color: 'blue'
            });
          }

          // Comprobar si hay una votación activa (entre la fecha de cierre y la fecha límite de votación)
          if (ahora > fechaCierre && ahora <= fechaLimiteVotacion) {
            isVotacionActiva = true;
            events.push({
              title: `${ronda.descripcionModulo}`,
              start: fechaCierre.toISOString().split('T')[0],
              end: fechaLimiteVotacion.toISOString().split('T')[0],
              color: 'green'
            });
          } else if (ahora < fechaCierre) {
            events.push({
              title: `${ronda.descripcionModulo}`,
              start: fechaCierre.toISOString().split('T')[0], 
              end: fechaLimiteVotacion.toISOString().split('T')[0], 
              color: 'green',
              textColor: 'white'
            });
          }

          // Evento de presentación de la charla
          events.push({
            title: `${ronda.descripcionModulo}`,
            date: fechaPresentacion.toISOString().split('T')[0],
            color: 'purple',
          });
        });

        this.isRondaAbierta = isRondaAbierta;
        this.isVotacionActiva = isVotacionActiva;
        this.calendarOptions.events = events;
      })
      .catch(error => {
        console.error('Error al obtener las rondas de charlas:', error);
      });
    }
  },
}
</script>

<style scoped>
  /* Estilo para la card activa (cuando está disponible) */
  .active-card {
    transition: box-shadow 0.3s ease-in-out;
  }

  .active-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
  }

  /* Estilo para la card inactiva (cuando no está disponible) */
  .inactive-card {
    background-color: #f8f9fa; 
    opacity: 0.6; 
    pointer-events: none; 
  }

  .inactive-card .card-body .btn {
    background-color: #6c757d; 
    border-color: #6c757d;
    pointer-events: none; 
  }

  td:hover{
    cursor: pointer;
  }

  .color-box {
    width: 20px;
    height: 20px;
    border-radius: 50%; /* Para hacer las cajas redondas */
  }

  span {
    font-size: 16px;
  }

  .calendar-wrapper {
    overflow-x: auto;
    width: 100%; /* 100% del ancho disponible */
    max-width: 100%;
    min-width: 510px !important;
  }
</style>