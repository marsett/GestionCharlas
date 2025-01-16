<template>
  <div>
    <!-- Mostrar spinner mientras se cargan los alumnos -->
    <div
      v-if="cargando"
      class="d-flex justify-content-center align-items-center vh-100"
    >
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div class="container my-3" v-if="role == 2">
      <h1 class="fw-semibold ">Hola, {{ nombre }} !</h1>
      <div class="row row-cols-1 row-cols-md-2 my-4 pt-2">
        <!-- Card para ronda abierta (no activa) -->
        <div class="col mb-3">
          <div class="custom-card" :class="{'inactive-card': !isRondaAbierta, 'active-card': isRondaAbierta}">

            <!-- Sección superior con forma de pestaña -->
            <div class="card-header">
              <div class="tab-header" :class="{'active-tab': isRondaAbierta, 'inactive-tab': !isRondaAbierta}">
                📢 {{ isRondaAbierta ? 'Rondas abiertas' : 'Sin rondas abiertas' }}
              </div>
            </div>

            <!-- Contenido principal de la tarjeta -->
            <div class="card-body p-4">
              <p class="card-text px-5">
                <span v-if="isRondaAbierta">
                  {{ puedeSubirCharla 
                    ? 'Actualmente hay una ronda abierta para subir charlas. ¡Aprovecha la oportunidad de compartir tus ideas!' 
                    : 'Actualmente hay una ronda abierta, pero ya tienes una charla registrada para esta ronda.' }}
                </span>
                <span v-else>
                  No hay rondas abiertas para subir charlas.
                </span>
              </p>

              <!-- Botón o formulario -->
              <button 
                :class="isRondaAbierta && puedeSubirCharla ? 'btn btn-primary' : 'btn btn-secondary text-black'"
                :disabled="!isRondaAbierta || !puedeSubirCharla"
                @click="$router.push('/charlas')"
                v-if="!isRondaAbierta || !puedeSubirCharla"
              >
                Subir charla
              </button>
              <FormNewCharla @evaluarRondas="actualizarContenido" v-else />
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
          <p class="text-secondary small mt-2">
            <b>Nota:</b> En el calendario se muestra el título de la ronda. Para ver los detalles de un día específico, haz clic en cualquier parte de la casilla correspondiente a ese día.
          </p>
        </div>

        <!-- Calendario -->
        <div class="mt-3">
          <!-- Contenedor con scroll horizontal -->
          <div class="parent-container">
            <div class="calendar-wrapper">
              <FullCalendar :options="calendarOptions" @mouseover="cambiarCursor"/>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container my-5" v-if="role == 1 && !cargando">
      <h2 class="text-center mb-4 fw-bold">{{ curso }}</h2>

      <!-- Fila de métricas clave -->
      <div class="row mt-5 mb-5">
        <!-- Total de Charlas Propuestas -->
        <div class="col-md-3 mb-3">
          <div class="card bg-primary text-white">
            <div class="card-body text-center">
              <h5>Charlas propuestas</h5>
              <h3>{{ totalCharlasPropuestas }}</h3>
            </div>
          </div>
        </div>
        <!-- Charlas Pendientes -->
        <div class="col-md-3 mb-3">
          <div class="card bg-warning text-dark">
            <div class="card-body text-center">
              <h5>Charlas pendientes</h5>
              <h3>{{ charlasPendientes }}</h3>
            </div>
          </div>
        </div>
        <!-- Total de Charlas Aceptadas -->
        <div class="col-md-3 mb-3">
          <div class="card bg-success text-white">
            <div class="card-body text-center">
              <h5>Charlas aceptadas</h5>
              <h3>{{ totalCharlasAceptadas }}</h3>
            </div>
          </div>
        </div>
        <!-- Usuarios Sin Subir Charla -->
        <div class="col-md-3 mb-3">
          <div class="card bg-danger text-white">
            <div class="card-body text-center">
              <h5>Alumnos sin charla</h5>
              <h3>{{ usuariosSinCharla }}</h3>
            </div>
          </div>
        </div>
      </div>

      <!-- Gráfico de barras -->
      <div class="mt-5 mb-5" >
        <canvas id="barChart"></canvas>
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


import { Chart, CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend } from 'chart.js';

// Registrar las escalas, elementos, y otros componentes
Chart.register(CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend);

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
      curso:"",
      isRondaAbierta: false, 
      isVotacionActiva: false,
      puedeSubirCharla: false, 
      puedeVotar: false, 
      rondas: [],
      totalCharlasPropuestas: 0,
      totalCharlasAceptadas: 0, 
      charlasPendientes: 0,
      usuariosSinCharla: 0, 
      progresoGeneral: 0, 
      cargando: false,
    };
  },
  mounted() {
    servicePerf.getUsuarioPerfil()
    .then(response => {
      this.nombre = response.usuario.nombre;
      this.role = response.usuario.idRole;

      if(this.role == 1){
        this.evaluarAlumnos();
      }

      if(this.role == 2){
        this.evaluarRondas(); 
      } 
    })
    .catch(error => {
      console.error('Error al obtener los datos de usuario:', error);
      this.cargando = false; 
    });
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
      this.cargando = true;
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

              const fechaCierreDia = new Date(fechaCierre.getFullYear(), fechaCierre.getMonth(), fechaCierre.getDate());
              // const fechaLimiteVotacionDia = new Date(fechaLimiteVotacion.getFullYear(), fechaLimiteVotacion.getMonth(), fechaLimiteVotacion.getDate());
              // const fechaPresentacionDia = new Date(fechaPresentacion.getFullYear(), fechaPresentacion.getMonth(), fechaPresentacion.getDate());

              // Comprobar si la ronda está abierta para solicitar charlas
              if (ahora < fechaCierreDia) {
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
                if (ahora > fechaCierreDia && ahora <= fechaLimiteVotacion){
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

              if (ahora <= fechaPresentacion) {
                // Evento de presentación de la charla
                events.push({
                  title: `${ronda.descripcionModulo}`,
                  date: fechaPresentacion.toISOString().split('T')[0],
                  color: 'purple',
                });
              }

            });

            // Actualizar variables de estado
            this.isRondaAbierta = isRondaAbierta;
            this.isVotacionActiva = isVotacionActiva;
            this.calendarOptions.events = events;

            // Si no hay rondas abiertas, no se puede subir charla
            if (!isRondaAbierta) {
              this.puedeSubirCharla = false;
            }

            this.cargando = false;
          })
          .catch(error => {
            console.error('Error al obtener los votos del alumno:', error);
            this.cargando = false;
          });
        })
        .catch(error => {
          console.error('Error al obtener las charlas del alumno:', error);
          this.cargando = false;
        });
      })
      .catch(error => {
        console.error('Error al obtener las rondas de charlas:', error);
        this.cargando = false;
      });
    },

    actualizarContenido() {
      this.evaluarRondas();
    },

    evaluarAlumnos(){
      this.cargando = true;
      servicePerf.getAlumnosCursoProfesor()
      .then(response => {
        this.curso = response[0].curso.nombre;
        const data = response[0].alumnos;

        // Verifica si hay alumnos
        if (!data || data.length === 0) {
          console.error('No hay alumnos en la respuesta');
          return;
        }

        // Filtrar solo alumnos y extraer los datos relevantes
        const alumnos = data
                        .filter(entry => entry.alumno.role === "ALUMNO" && entry.alumno.estadoUsuario == true)
                        .map(entry => ({
                          nombre: entry.alumno.usuario,
                          charlasPropuestas: entry.charlasPropuestas || 0,
                          charlasAceptadas: entry.charlasAceptadas || 0,
                        }));

        // Extraemos la información de los alumnos
        const labels = alumnos.map(alumno => alumno.nombre);
        const propuestas = alumnos.map(alumno => alumno.charlasPropuestas);
        const aceptadas = alumnos.map(alumno => alumno.charlasAceptadas);

        // Encontrar el valor máximo entre charlas propuestas y aceptadas.
        const maxCharlasPropuestas = Math.max(...propuestas);
        const maxCharlasAceptadas = Math.max(...aceptadas);

        // El valor máximo para la escala Y será el máximo entre ambos más 1.
        const maxCharlas = Math.max(maxCharlasPropuestas, maxCharlasAceptadas) + 1;

        // Configurar los datos para el gráfico
        const barData = {
          labels: labels, // Las etiquetas del gráfico
          datasets: [
            {
              label: 'Charlas Propuestas',
              data: propuestas, // Los datos para las charlas propuestas
              backgroundColor: 'rgba(102, 179, 255, 0.2)', // Color de fondo para las barras
              borderColor: 'rgba(102, 179, 255, 1)', // Color del borde
              borderWidth: 1, // Ancho del borde
            },
            {
              label: 'Charlas Aceptadas',
              data: aceptadas, // Los datos para las charlas aceptadas
              backgroundColor: 'rgba(113, 214, 125, 0.2)', 
              borderColor: 'rgba(113, 214, 125, 1)', 
              borderWidth: 1, 
            }
          ]
        };

        // Total de charlas propuestas y aceptadas
        const totalCharlasPropuestas = propuestas.reduce((sum, propuestas) => sum + propuestas, 0);
        const totalCharlasAceptadas = aceptadas.reduce((sum, aceptadas) => sum + aceptadas, 0);

        // Charlas pendientes (propuestas - aceptadas)
        const charlasPendientes = totalCharlasPropuestas - totalCharlasAceptadas;

        // Usuarios que no han subido su charla
        const usuariosSinCharla = alumnos.filter(alumno => alumno.charlasPropuestas === 0 && alumno.charlasAceptadas === 0).length;

        // Asignamos los valores calculados a las variables de data()
        this.totalCharlasPropuestas = totalCharlasPropuestas;
        this.totalCharlasAceptadas = totalCharlasAceptadas;
        this.charlasPendientes = charlasPendientes;
        this.usuariosSinCharla = usuariosSinCharla;

        this.cargando = false; 

        this.mostrarDiagrama(barData, maxCharlas);
      })
      .catch(error => {
        console.error('Error al obtener los alumnos de un profesor:', error);
        this.cargando = false;
      });
    },

    mostrarDiagrama(barData, maxCharlas){
      // Espera a que el DOM se actualice antes de intentar obtener el canvas
      this.$nextTick(() => {
        const ctx = document.getElementById('barChart').getContext('2d');
          if (ctx) {
            const diagrama  = new Chart(ctx, {
                type: 'bar', // Tipo de gráfico
                data: barData, // Datos del gráfico
                options: {
                  responsive: true,
                  maintainAspectRatio: false, // Para que el gráfico se adapte al tamaño del contenedor
                  plugins: {
                    legend: {
                        position: 'top', // Posición de la leyenda
                    },
                    tooltip: {
                        enabled: true, // Habilitar tooltips
                    }
                  },
                  scales: {
                    x: {
                      beginAtZero: true, // Asegurarse de que el eje X comience en cero
                      tickRotation: 45, // Rotar las etiquetas para que se vean bien
                      ticks: {
                        maxRotation: 90,
                        minRotation: 45
                      },
                      categoryPercentage: 0.8, // Controla el ancho de las barras en relación con el espacio disponible
                      barPercentage: 0.9, // Ajusta el porcentaje de la barra
                    },
                    y: {
                      beginAtZero: true, // Asegurarse de que el eje Y comience en cero
                      max: maxCharlas,
                      ticks: {
                        stepSize: 1 // Ajusta el tamaño de cada paso en el eje Y
                      }
                    }
                  }
                }
            });

            diagrama;
          } else {
            console.error("Error: No se pudo obtener el contexto del gráfico");
          }
      });
    },

    cambiarCursor(event) {
      event.target.style.cursor = 'pointer';
    },
  },
}
</script>

<style scoped>

.container{
  background-color: #FDFAFA!important;
  padding:55px 20px 0px 20px;
  margin-top: 0px!important;
  
}
  /* Estilo para la card activa (cuando está disponible) */
  .active-card {
    transition: box-shadow 0.3s ease-in-out;
  }

  .active-card:hover {
    box-shadow: 0 15px 30px -15px rgba(213, 206, 188, 0.55);
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

  #barChart{
    height: 400px;
    width: 400px;
  }








.custom-card {
  background-color: #f9f5ec; /* Fondo beige claro */
  border-radius: 15px; /* Bordes redondeados */
  position: relative; /* Necesario para la pestaña */
  overflow: hidden; /* Oculta contenido que salga del borde */
  padding-top: 44px; /* Espacio para la pestaña superior */
  transition: all 0.3s ease; /* Animaciones suaves */
}

.card-header{
  width: 100%;
  background-color: #FDFAFA;
  height: 43px;
  position: absolute;
  top: 0;
  left: 0;
}

/* Pestaña superior */
.tab-header {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #F5ECD5; /* Fondo beige */
  padding: 8px 24px;
  border-radius: 16px 16px 0 0; /* Bordes redondeados superiores */
  font-size: 18px; /* Tamaño del texto */
  font-weight: bold; /* Negrita */
  color: #333; /* Color del texto */
  text-align: center;
  box-shadow: 2px 2px 4px #e2dbc787; /* Sombra para destacarla */
  transition: background-color 0.3s ease; /* Transición suave de color */
}

/* Pestaña activa */
.active-tab {
  background-color: #F5ECD5; /* Verde claro */
  color: #333; /* Texto verde oscuro */
}

/* Pestaña inactiva */
.inactive-tab {
  background-color: #F5ECD5; /* Rojo claro */
  color: #721c24; /* Texto rojo oscuro */
}

/* Contenido principal de la tarjeta */
.card-body {
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Sombra ligera */
  border: 2px solid #e2dbc787; /* Borde tenue */
}

/* Título */
.card-title {
  font-size: 18px; /* Tamaño mediano */
  color: #333; /* Gris oscuro */
  margin-bottom: 12px; /* Separación inferior */
  font-weight: bold;
}

/* Texto descriptivo */
.card-text {
  font-size: 17px; /* Tamaño mediano */
  color: #555; /* Gris medio */
  margin-bottom: 16px; /* Separación inferior */
}

/* Pie de la tarjeta */
.card-footer {
  font-size: 14px; /* Tamaño más pequeño */
  color: #777; /* Gris tenue */
  margin-top: 10px; /* Separación superior */
}

/* Botones */
.btn-primary {
  background-color: #4caf50; /* Verde */
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}

.btn-secondary {
  background-color: #cccccc; /* Gris */
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: not-allowed;
}

</style>