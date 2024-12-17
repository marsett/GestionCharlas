<template>
  <div class="container my-3" v-if="role == 2">
    <h1 class="fw-semibold mt-4 mt-md-5">Hola, {{ nombre }} !</h1>
    <div class="row row-cols-1 row-cols-md-2 my-4 pt-2">
      <!-- Card para ronda abierta (no activa) -->
      <div class="col mb-3">
        <div :class="{'card': true, 'inactive-card': !isRondaAbierta, 'active-card': isRondaAbierta}">
          <div class="card-body text-center">
            <h5 class="card-title">📢 Ronda Abierta</h5>
            <p class="card-text">
              <!-- Mensaje para indicar si puede subir charla o no -->
              <span v-if="isRondaAbierta">
                {{ puedeSubirCharla 
                  ? 'Actualmente hay una ronda abierta para subir charlas. ¡Aprovecha la oportunidad de compartir tus ideas!' 
                  : 'Actualmente hay una ronda abierta, pero ya tienes una charla registrada para esta ronda.' }}
              </span>
              <span v-else>
                No hay rondas abiertas para subir charlas.
              </span>
            </p>
            <!-- Button en lugar de router link porque si pones 2 condiciones para que sea disabled, no tiene ningun efecto -->
            <button 
              :class="isRondaAbierta && puedeSubirCharla ? 'btn btn-primary' : 'btn btn-secondary'"
              :disabled="!isRondaAbierta || !puedeSubirCharla"
              @click="$router.push('/charlas')"
              v-if="!isRondaAbierta || !puedeSubirCharla"
            >
              Subir charla
            </button>
            <FormNewCharla @evaluarRondas="actualizarContenido" v-else/>
          </div>
        </div>  
      </div>
    
      <!-- Card para votación activa (activa o no activa) -->
      <div class="col mb-3">
        <div :class="{'card': true, 'inactive-card': !isVotacionActiva, 'active-card': isVotacionActiva}">
          <div class="card-body text-center">
            <h5 class="card-title">🔔 Votación Activa</h5>
            <p class="card-text">
              <span v-if="isVotacionActiva">
                {{ !puedeVotar 
                  ? 'La votación está activa, pero ya has emitido tu voto. ¡Gracias por participar!' 
                  : 'Actualmente hay una votación activa para elegir las próximas charlas. ¡Haz que tu voz cuente!' 
                }}
              </span>
              <span v-else>
                No hay votaciones activas en este momento.
              </span>
            </p>
            <button 
              :class="isVotacionActiva && puedeVotar ? 'btn btn-primary' : 'btn btn-secondary'"
              :disabled="!isVotacionActiva || !puedeVotar"
              @click="$router.push('/charlas')"
            >
              Ir a Votar
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-4">
      <h1 class="mt-4 pt-0 mt-md-4 pt-md-3">Calendario</h1>
      <hr class="  mb-4 pb-2">
      <!-- Guía de colores -->
      <div>
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
        <div class="parent-container">
          <div class="calendar-wrapper">
            <FullCalendar :options="calendarOptions" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es'; 
import Swal from 'sweetalert2';
import PerfilService from '@/services/PerfilService';
import CharlasService from '@/services/CharlasService';
import FormNewCharla from './FormNewCharla.vue';

const servicePerf = new PerfilService();
const serviceChar = new CharlasService();

export default {
  name: "HomeComponent",
  components: {
    FullCalendar,
    FormNewCharla,
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
      puedeSubirCharla: false, 
      puedeVotar: false, 
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

      // console.log('Eventos:', this.calendarOptions.events);  // Verifica los eventos disponibles

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
          return selectedDate >= startDate && selectedDate < endDate || startDate.toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0];
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
      // Obtener las rondas.
      serviceChar.getRondas()
      .then(response => {
        this.rondas = response;
        const ahora = new Date();

        let isRondaAbierta = false;
        let isVotacionActiva = false;
        this.puedeSubirCharla = false;
        const events = []; // Para llenar el calendario

        // Obtener las charlas del alumno
        serviceChar.getCharlasAlumno()
        .then(charlasAlumno => {
          
          // Obtener los votos del alumno
          serviceChar.getVotosAlumno()
          .then(votosAlumno => {
            
            this.rondas.forEach(ronda => {
              const fechaCierre = new Date(ronda.fechaCierre + 'Z'); // Agregar "Z" al final para interpretar como UTC
              const fechaLimiteVotacion = new Date(ronda.fechaLimiteVotacion + 'Z');
              const fechaPresentacion = new Date(ronda.fechaPresentacion + 'Z');

              // Comprobar si la ronda está abierta para solicitar charlas
              if (ahora <= fechaCierre) {
                isRondaAbierta = true;

                events.push({
                  title: `${ronda.descripcionModulo}`,
                  start: ahora.toISOString().split('T')[0],
                  end: fechaCierre.toISOString().split('T')[0],
                  color: 'blue'
                });

                // Verificar si el alumno ya tiene una charla asociada a esta ronda
                const charlaEnRonda = charlasAlumno.some(charla => charla.charla.idRonda === ronda.idRonda);

                // Si no tiene charla en esta ronda, puede subir una nueva
                if (!charlaEnRonda) {
                  this.puedeSubirCharla = true;
                }
              }

              // Comprobar si hay una votación activa (entre la fecha de cierre y la fecha límite de votación)
              if (ahora <= fechaLimiteVotacion) {
                if (ahora > fechaCierre && ahora <= fechaLimiteVotacion){
                  isVotacionActiva = true;

                  // Verificar si el alumno ya votó en esta ronda
                  const votoEnRonda = votosAlumno.some(voto => voto.idRonda === ronda.idRonda);
  
                  if (!votoEnRonda) {
                    this.puedeVotar = true;
                  }
                }

                events.push({
                  title: `${ronda.descripcionModulo}`,
                  start: fechaCierre.toISOString().split('T')[0],
                  end: fechaLimiteVotacion.toISOString().split('T')[0],
                  color: 'green'
                });
              }

              // Evento de presentación de la charla
              events.push({
                title: `${ronda.descripcionModulo}`,
                date: fechaPresentacion.toISOString().split('T')[0],
                color: 'purple',
              });
            });

            // Actualizar variables de estado
            this.isRondaAbierta = isRondaAbierta;
            this.isVotacionActiva = isVotacionActiva;
            this.calendarOptions.events = events;

            // Si no hay rondas abiertas, no se puede subir charla
            if (!isRondaAbierta) {
              this.puedeSubirCharla = false;
            }
          })
          .catch(error => {
            console.error('Error al obtener los votos del alumno:', error);
          });
        })
        .catch(error => {
          console.error('Error al obtener las charlas del alumno:', error);
        });
      })
      .catch(error => {
        console.error('Error al obtener las rondas de charlas:', error);
      });
    },

    actualizarContenido() {
      this.evaluarRondas();
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

  .parent-container {
    overflow-x: auto;
    width: 100%;
  }

  .calendar-wrapper {
    overflow-x: auto;
    width: 100%;
    max-width: 100%;
    min-width: 510px;
  }
</style>