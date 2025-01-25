<template>
  <div>
    <!-- Mostrar spinner mientras se cargan los alumnos -->
    <div
      v-if="cargando"
      class="d-flex justify-content-center align-items-center vh-100"
    >
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div class="container my-3" v-if="role == 2 && !cargando">
      <h1 class="fw-bold">Hola, {{ nombre }} !</h1>
      <div class="row row-cols-1 row-cols-md-2 mb-3 mt-4 pt-4">
        <!-- Card para ronda abierta -->
        <div class="col mb-3">
          <div class="custom-card" :class="{'inactive-card': !isRondaAbierta, 'active-card': isRondaAbierta}">

            <!-- Sección superior con forma de pestaña -->
            <div class="card-header">
              <div class="tab-header" :class="{'active-tab': isRondaAbierta, 'inactive-tab': !isRondaAbierta}">
                <i class="fa-regular fa-folder-open me-2"></i> {{ isRondaAbierta ? 'Rondas abiertas' : 'Sin rondas abiertas' }}
              </div>
            </div>

            <!-- Contenido principal de la tarjeta -->
            <div class="card-body p-4 text-center">
              <p class="card-text px-lg-5">
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
                class="btn" :class="isRondaAbierta && puedeSubirCharla ? 'btn-primary' : 'btn-secondary text-black'"
                :disabled="!isRondaAbierta || !puedeSubirCharla"
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
          <div class="custom-card border-0" :class="{'card': true, 'inactive-card': !isVotacionActiva, 'active-card': isVotacionActiva}">
            
            <!-- Sección superior con forma de pestaña -->
            <div class="card-header border-0">
              <div class="tab-header" :class="{'active-tab': isVotacionActiva, 'inactive-tab': !isVotacionActiva}">
                <i class="fa-solid fa-bell me-2"></i> {{ isVotacionActiva ? 'Votaciones activas' : 'Sin votaciones activas' }}
              </div>
            </div>

            <!-- Contenido principal -->
            <div class="card-body p-4 text-center">
              <p class="card-text px-lg-5">
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
              
              <!-- Botón para ir a charlas -->
              <button 
                class="btn btn-mover me-1"
                @click="$router.push('/charlas')"
              >
                Ir a charlas
              </button>

              <!-- Botón charlas o formulario -->
              <button 
                class="btn ms-2" :class="isVotacionActiva && puedeVotar ? 'btn-primary' : 'btn-secondary text-whiite'"
                :disabled="!isVotacionActiva || !puedeVotar"
                v-if="!isVotacionActiva || !puedeVotar"
              >
                Votar charla
              </button>
              <FormVotacion @evaluarRondas="actualizarContenido"  v-else />
            </div> 
          </div>
        </div>
      </div>

      <hr class="my-4 py-2">

      <div class="row mt-3 mb-4 pt-0">
        <div class="mb-4 col-lg-8">
          <h1 class="mb-4 mt-2 pt-0 fw-semibold">Calendario</h1>
            <!-- Guía de colores -->
            <div>
              <div class="row">
                <!-- Ronda Abierta -->
                <div class="col-md-auto">
                  <div class="d-flex align-items-md-center">
                    <div class="color-box" style="background-color: #d76060;"></div>
                    <span class="ms-2">Ronda abierta</span>
                  </div>
                </div>
                <!-- Votación Activa -->
                <div class="col-md-auto">
                  <div class="d-flex align-items-md-center">
                    <div class="color-box" style="background-color: #578e73;"></div>
                    <span class="ms-2">Votación activa</span>
                  </div>
                </div>
                <!-- Votación Terminada -->
                <div class="col-md-auto">
                  <div class="d-flex align-items-md-center">
                    <div class="color-box" style="background-color: #314B78;"></div>
                    <span class="ms-2">Presentación</span>
                  </div>
                </div>
              </div>
              <p class="text-secondary small mt-2">
                <b>Nota:</b> Para ver los detalles de un día específico, haz clic en la parte de la casilla correspondiente a ese día.
              </p>
            </div>

            <!-- Calendario -->
            <div class="mt-3">
              <!-- Contenedor con scroll horizontal -->
              <div class="parent-container">
                <div class="calendar-wrapper">
                  <FullCalendar :options="calendarOptions"/>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mb-4 ps-lg-3 col-12 col-lg-4">
            <h2 class="mb-4 pt-0 espacio-150">Presentaciones</h2>
            <ul class="list-group mt-4">
              <!-- Iterar sobre las fechas de eventos tipo "purple" -->
              <li 
                class="list-group-item"
                v-for="(evento, index) in eventosPresentaciones" 
                :key="index"
              >
                <!-- Contenedor alineado horizontalmente -->
                <div class="d-flex align-items-center flex-nowrap w-100">
                  <!-- Badge para el día -->
                  <span 
                    class="badge rounded-circle me-3" 
                    style=" color: white; min-width: 40px; height: 40px; display: flex; justify-content: center; align-items: center;"
                  >
                    {{ new Date(evento.date).getDate() }}
                  </span>
                  <!-- Título del evento -->
                  <span class="flex-grow-1 text-truncate">
                    {{ evento.title }}
                  </span>
                  <!-- Fecha del mes -->
                  <small class="text-muted ms-3">
                    {{ formatoMes(evento.date) }}
                  </small>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

    <div class="container my-5" v-if="role == 1 && !cargando">
      <h1 class="fw-bold">Bienvenido, {{ nombre }} !</h1>
      <div class="row mt-lg-4 mt-2 pt-3">
        <!-- Columna izquierda: Presentaciones -->
        <div class="col-md-5">
          <h2 class="mb-4 fw-semibold">Próximas charlas:</h2>
          <div class="list-group">
            <!-- Mostrar solo los primeros cinco eventos si no se ha hecho clic en "Ver más" -->
            <div 
              class="list-group-item d-flex align-items-center" 
              v-for="(evento, index) in (mostrarTodos ? presentacionesPendientes : presentacionesPendientes.slice(0, 4))" 
              :key="index"
            >
              <span 
                class="badge rounded-circle me-3 p-3"
                style=" color: white; min-width: 40px; height: 40px; display: flex; justify-content: center; align-items: center;"
              >{{ new Date(evento.fechaPresentacion).getDate() }}</span>
              <span>{{ evento.descripcionModulo }}</span>
              <small class="text-muted ms-3">
                {{ formatoMes(evento.fechaPresentacion) }}
              </small>
            </div>

            <!-- Botón "Ver más" o "Ver menos" -->
            <div v-if="presentacionesPendientes.length > 4" class="text-end mt-1">
              <button 
                class="btn btn-primary" 
                @click="toggleMostrarTodos"
              >
                {{ mostrarTodos ? 'Ver menos' : 'Ver más' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Columna derecha: Formulario (simulado con un cuadrado de color) -->
        <div class="col-md-7 ps-md-5 pt-3 d-flex justify-content-center align-items-center">
          <div 
            class="border rounded-4 p-4" 
            style="width: 100%; height: 100%; max-height: 282px; background-color: #a0a0a0;">
            
            <!-- Contenedor interno -->
            <div 
              class="text-center text-muted h-100 d-flex flex-column justify-content-center align-items-center p-4" 
              style="background-color: #e0e0e0; border-radius: 15px;">

              <!-- Mensaje -->
              <p class="mb-4 fw-semibold h5 px-5 mx-3">
                ¡Crea una nueva ronda para que tus alumnos puedan proponer sus charlas!
              </p>

              <!-- Botón -->
              <!-- <button class="btn btn-mover px-4 py-2" style="border-radius: 10px; font-size: 1rem;">
                Crear nueva ronda
              </button> -->
              <FormNewRonda @evaluarRondas="actualizarContenido"/>
            </div>
          </div>
        </div>
      </div>

      <!-- <hr class="my-5 py-3"/> -->

      <h2 class="mt-5 pt-3 fw-semibold">Estadísticas:</h2>
      <p class="mb-4 small"><b>Nota:</b> pulsa sobre los botones para generar los gráficos a tiempo real.</p>
      <button class="btn btn-mover me-2">Rondas</button>
      <button class="btn btn-mover me-2">Alumnos</button>
      




      <br><br><br><br><br>
      <br><br><br><br><br>
      <br><br><br><br><br>

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
import FormVotacion from './FormVotacion.vue';
import FormNewRonda from './FormNewRonda.vue';

// Registrar las escalas, elementos, y otros componentes
Chart.register(CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend);

const servicePerf = new PerfilService();
const serviceChar = new CharlasService();

export default {
  name: "HomeComponent",
  components: {
    FullCalendar,
    FormNewCharla,
    FormVotacion,
    FormNewRonda,
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
      eventosPresentaciones: [],
      nombre: "",
      role: "",
      curso:"",
      isRondaAbierta: false, 
      isVotacionActiva: false,
      puedeSubirCharla: false, 
      puedeVotar: false, 
      rondas: [],
      rondasProfe: [],
      presentacionesPendientes:[],
      totalCharlasPropuestas: 0,
      totalCharlasAceptadas: 0, 
      charlasPendientes: 0,
      usuariosSinCharla: 0, 
      progresoGeneral: 0, 
      cargando: false,
      mostrarTodos: false,
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
              case '#d76060':
                eventType = "Ronda Abierta";
                break;
              case '#578e73':
                eventType = "Votación Activa";
                break;
              case '#314B78':
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
                  color: '#d76060'
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
                  color: '#578e73'
                });
              }

              if (ahora <= fechaPresentacion) {
                // Evento de presentación de la charla
                const eventoPresentacion = {
                  title: `${ronda.descripcionModulo}`,
                  date: fechaPresentacion.toISOString().split('T')[0],
                  color: '#314B78',
                };

                events.push(eventoPresentacion);

                // Añadir directamente a eventosPresentaciones
                this.eventosPresentaciones.push(eventoPresentacion);
                this.eventosPresentaciones.sort((a, b) => new Date(a.date) - new Date(b.date));
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

    formatoMes(fecha) {
      const opciones = { month: 'long' };  // 'long' te da el nombre completo del mes, 'short' lo da abreviado.
      return new Date(fecha).toLocaleDateString('es-ES', opciones).replace(/^./, letra => letra.toUpperCase());
    },


    actualizarContenido() {
      this.evaluarAlumnos();
    },

    evaluarAlumnos(){
      this.cargando = true;
      servicePerf.getAlumnosCursoActivoProfesor()
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

        servicePerf.getRondasProfesor()
        .then(rondas => {
          // Obtenemos la fecha actual
          const fechaActual = new Date();

          // Filtramos las rondas con fecha de presentación futura
          this.presentacionesPendientes = rondas
          .filter(ronda => new Date(ronda.fechaPresentacion) > fechaActual) 
          .map(({ idRonda, fechaPresentacion, descripcionModulo }) => ({
            idRonda,
            fechaPresentacion,
            descripcionModulo
          }))
          .sort((a, b) => new Date(a.fechaPresentacion) - new Date(b.fechaPresentacion)); 

          this.rondasProfe = rondas; // Si necesitas todas las rondas, mantenlas aquí también

          barData
          maxCharlas

          // this.mostrarDiagrama(barData, maxCharlas);
        })
        .catch(error => {
          console.error('Error al obtener las rondas de un profesor:', error);
          this.cargando = false;
        });
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

    toggleMostrarTodos() {
      this.mostrarTodos = !this.mostrarTodos;
    },

    watch: {
      'calendarOptions.events': {
        handler(newEvents) {
          this.eventosPresentaciones = newEvents.filter(evento => evento.color === '#314B78');
        },
        immediate: true,
        deep: true
      }
    },
  },
}
</script>

<style scoped>
  .container{
    /* background-color: #FDFAFA!important; */
    padding:55px 20px 0px 20px;
    margin-top: 0px !important;
    margin-bottom: 30px !important;
    background: linear-gradient(
      to top,
      hsla(128, 21%, 57%, 0.5) 0%,   
      #FDFAFA 68%    
    );
    border-radius: 18px;
    color: inherit;
  }

  .active-card {
    transition: box-shadow 0.3s ease-in-out;
  }

  .active-card:hover {
    box-shadow: 0 15px 30px -15px rgba(213, 206, 188, 0.55);
  }

  .color-box {
    width: 20px;
    height: 20px;
    border-radius: 50%;
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
    background-color: #f9f5ec; 
    border-radius: 15px; 
    position: relative; 
    overflow: hidden; 
    padding-top: 44px; 
    transition: all 0.3s ease;
  }

  .card-header{
    width: 100%;
    background-color: #FDFAFA;
    height: 43px;
    position: absolute;
    top: 0;
    left: 0;
  }

  .tab-header {
    position: absolute;
    top: 0;
    left: 0;
    background-color: #F5ECD5; 
    padding: 8px 24px;
    border-radius: 16px 16px 0 0; 
    font-size: 18px; 
    font-weight: bold;
    color: #333; 
    text-align: center;
    box-shadow: 2px 2px 4px #e2dbc787; 
    transition: background-color 0.3s ease;
  }

  .active-tab {
    background-color: #F5ECD5; 
  }

  .inactive-tab {
    background-color: #F5ECD5; 
  }

  .card-body {
    padding: 20px;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
    border: 2px solid #e2dbc787; 
  }

  .card-title {
    font-size: 18px; 
    color: #333; 
    margin-bottom: 12px; 
    font-weight: bold;
  }

  .card-text {
    font-size: 17px;
    color: #555; 
    margin-bottom: 16px;
  }

  ::v-deep(.btn-primary) {
    background-color: #40685c !important; 
    border: none;
    color: white;
    border-radius: 8px;
    cursor: pointer;
  }

  ::v-deep(.btn-primary:active) {
    border-color: #40685c !important;
    background-color: #578e73 !important;
  }

  ::v-deep(.btn-primary:hover) {
    border-color: #40685c !important;
    background-color: #578e73 !important;
  }

  .btn-mover {
    background-color: #314B78 !important; 
    border: none;
    color: white;
    border-radius: 8px;
    cursor: pointer;
  }

  .btn-mover:active {
    border-color: #314B78 !important;
    background-color: #41619a !important;
    color: white;
  }

  .btn-mover:hover {
    border-color: #314B78 !important;
    background-color: #41619a !important;
    color: white;
  }

  ::v-deep(.btn-secondary) {
    background-color: #6a8d92 !important;
    border: none;
    color: white;
    border-radius: 8px;
  }

  ::v-deep(.btn-secondary:hover) {
    background-color: #577478 !important;
  }

  ::v-deep(.btn-secondary:active) {
    background-color: #577478 !important;
  }

  ::v-deep(.btn.ms-2.btn-secondary.text-white){
    background-color: #6a8d92 !important; 
    opacity: 1;
  }

  ::v-deep(button.fc-today-button.fc-button.fc-button-primary) {
    background-color: #6a8d92;
    border-color: #6a8d92;
    color: white;
  }


  ::v-deep(.fc-prev-button.fc-button.fc-button-primary){
    background-color: #40685c;
    border-color: #40685c;
    color: white;
  }

  ::v-deep(.fc-next-button.fc-button.fc-button-primary){
    background-color: #40685c;
    border-color: #40685c;
    color: white;
  }

  ::v-deep(
    .fc-prev-button.fc-button.fc-button-primary:hover, 
    .fc-prev-button.fc-button.fc-button-primary:active
  ){
    border-color: #578e73;
    background-color: #578e73;
    color: white;
  }

  ::v-deep(
    .fc-next-button.fc-button.fc-button-primary:hover,
    .fc-next-button.fc-button.fc-button-primary:active
  ){
    border-color: #578e73;
    background-color: #578e73;
    color: white;
  }

  ::v-deep(.fc-next-button.fc-button.fc-button-primary){
    background-color: #436c60;
    border-color: #436c60;
    color: white;
  }

  ::v-deep(.fc-toolbar-title::first-letter){
    text-transform: uppercase;
  }

  ::v-deep(.fc-scrollgrid.fc-scrollgrid-liquid){
    background-color: white;
  }
  
  ::v-deep(.fc-daygrid-day-frame.fc-scrollgrid-sync-inner){
    min-height: 100px;
  }

  ::v-deep(.fc-col-header-cell.fc-day){
    background-color: #20324e;
  }
  ::v-deep(.fc-col-header-cell-cushion){
    color: white;
    font-weight: bold;
    text-decoration: none;
  }

  ::v-deep(.fc-daygrid-day-number){
    color: #20324e;
    cursor: pointer;
  }

  ::v-deep(.fc-daygrid-day.fc-day-today){
    background-color: #F5ECD5;
  }

  .list-group-item {
    background-color: #ced7e7;
    border: 1px solid #314b7882;
    /* background-color: #f9f5ec;
    border: 2px solid #F5ECD5; */
    border-radius: 8px;
    margin-bottom: 10px;
    padding: 10px 15px;
    display: flex; /* Para asegurar que el contenedor sea flexible */
    flex-direction: row; /* Alinea el contenido horizontalmente */
    align-items: center; /* Centra verticalmente */
    justify-content: space-between; /* Espacia los elementos */
  }


  .badge {
    background-color: #314B78;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
  }

  .espacio-150{
    margin-top: 10px;
  }

  @media (min-width: 992px) {
    .espacio-150 {
      margin-top: 150px;
    }
  } 

  ::v-deep(){
    
  }
  ::v-deep(){
    
  }
  ::v-deep(){
    
  }
  ::v-deep(){
    
  }
  ::v-deep(){
    
  }
  ::v-deep(){
    
  }
  ::v-deep(){
    
  }
  ::v-deep(){
    
  }
  ::v-deep(){
    
  }

</style>