<template>
  <div>
    <div class="container" v-if="rolActual === 'ALUMNO'">
      <!-- Filtro por ronda -->
      <div class="row row-cols-1 row-cols-md-2 mt-5">
        <div class="col">
          <label for="filtroRonda" class="form-label fw-semibold h5">Filtrar por ronda:</label>
          <select id="filtroRonda" class="form-select" v-model="filtroRonda" @change="filtrarCharlas">
            <option value="0" selected>Todas las rondas</option>
            <option v-for="ronda in rondas" :key="ronda.idRonda" :value="ronda.idRonda">
              {{ `Ronda ${ronda.idRonda} - ${ronda.descripcionModulo}` }}
            </option>
          </select>
        </div>

        <div class="col">
          <label for="filtroEstado" class="form-label fw-semibold h5">Filtrar por estado:</label>
          <select id="filtroEstado" class="form-select" v-model="filtroEstado" @change="filtrarCharlas">
            <option value="">Todos los Estados</option>
            <option v-for="estado in estadosDisponibles" :key="estado" :value="estado">
              {{ estado }}
            </option>
          </select>
        </div>
      </div>

      <div class="flex-container">
        <h5 style="margin-left: 18px;">Rondas</h5>
        <h5 style="margin-right: 20px;">Tiempo restante</h5>
      </div>
      <hr>

      <!-- Collapses de rondas -->
      <div class="accordion mt-4" id="accordionRondas">
        <div v-for="ronda in rondasFiltradas" :key="ronda.idRonda" class="accordion-item">
          <h2 class="accordion-header" :id="`heading-${ronda.idRonda}`">
            <button class="accordion-button collapsed d-flex justify-content-between align-items-center" type="button"
              data-bs-toggle="collapse" :data-bs-target="`#collapse-${ronda.idRonda}`" aria-expanded="false"
              :aria-controls="`collapse-${ronda.idRonda}`">
              <span>{{ `Ronda ${ronda.idRonda} - ${ronda.descripcionModulo}` }}</span>
              <span class="text-muted ms-auto">
                {{ obtenerTiempoRestante(ronda) }}
              </span>
            </button>
          </h2>


          <div :id="`collapse-${ronda.idRonda}`" class="accordion-collapse collapse"
            :aria-labelledby="`heading-${ronda.idRonda}`" data-bs-parent="#accordionRondas">
            <div class="accordion-body">
              <div class="row g-3">
                <!-- Cards de charlas dentro de cada ronda -->
                <div class="col-md-4 mb-4" v-for="charla in charlasPorRonda(ronda.idRonda)" :key="charla.idCharla">
                  <div class="card">
                    <div v-if="charla.estadoCharla" :class="estadoClass(charla.estadoCharla)" class="estado-btn">
                      {{ charla.estadoCharla }}
                    </div>
                    <img class="card-img-top" :src="charla.imagenCharla ||
                      require('../assets/banner_default.jpg')
                      " @error="onImageError($event)" alt="Imagen de Charla" />
                    <div class="card-body">
                      <h5 class="card-title">{{ charla.titulo }}</h5>
                      <p class="card-text">{{ charla.descripcion }}</p>
                      <p class="card-text">Recursos: {{ charla.recursos }}</p>
                    </div>
                    <div class="card-footer">
                      <small class="text-body-secondary">
                        <button class="btn custom-button" @click="abrirModal(charla)">
                          Ver detalles
                        </button>
                      </small>
                    </div>
                  </div>
                </div>
                <!-- Mensaje si no hay charlas -->
                <div v-if="charlasPorRonda(ronda.idRonda).length === 0" class="text-center text-muted">
                  No hay charlas disponibles para esta ronda.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para mostrar detalles -->
    <div v-if="mostrarModal" class="modal fade show" @click.self="cerrarModal" tabindex="-1" role="dialog"
      style="display: block; background: rgba(0, 0, 0, 0.8)">
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ charlaSeleccionada.titulo }}</h5>
            <button type="button" class="btn-close" aria-label="Close" @click="cerrarModal"></button>
          </div>
          <div class="modal-body">
            <p class="timestamp"> 
              <strong>Fecha Propuesta:</strong> 
              {{ charlaSeleccionada.fechaPropuesta }}
            </p>
            <p><strong>Usuario:</strong> {{ charlaSeleccionada.usuario }}</p>
            <p><strong>Curso:</strong> {{ charlaSeleccionada.nombreCurso }}</p>
            <p><strong>Estado:</strong> {{ charlaSeleccionada.estadoCharla }}</p>
            <p><strong>Recursos adjuntados:</strong> {{ charlaSeleccionada.recursos }}</p>
            <!-- Botones para cambiar entre Descripción y Comentarios -->
            <div class="d-flex custom-buttons-container">
              <button class="custom-button"
                @click="mostrarDescripcion = !mostrarDescripcion; mostrarComentarios = false;"
                :class="{ 'active': mostrarDescripcion }">
                <i class="fa-solid fa-circle-info iconos"></i>
                Descripción
              </button>
              <button class="custom-button"
                @click="mostrarDescripcion = false; mostrarComentarios = !mostrarComentarios"
                :class="{ 'active': mostrarComentarios }">
                <i class="fa-solid fa-comments iconos"></i>
                Comentarios
              </button>
            </div>

            <hr v-if="mostrarDescripcion || mostrarComentarios" />

            <!-- Sección de Descripción -->
            <div v-if="mostrarDescripcion" class="custom-background custom-descripcion">
              <p>
                {{ charlaSeleccionada.descripcion }}
              </p>
            </div>

            <!-- Sección de Comentarios // Sofi -->
            <div v-if="mostrarComentarios">
              <div v-if="comentarios.length > 0" class="custom-background">

                <!-- Contenedor con scroll si hay más de dos comentarios -->
                <ul class="comment-list">
                  <li v-for="comentario in comentarios" :key="comentario.idComentario" class="comment-item">
                    <div class="comment-header">
                      <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                        alt="avatar" class="avatar" />
                      <div>
                        <p class="username">{{ comentario.usuario }}</p>
                        <p class="timestamp">{{ comentario.fecha }}</p>
                      </div>
                    </div>
                    <p class="comment-text">{{ comentario.contenido }}</p>
                  </li>
                </ul>
              </div>

              <!-- Si no hay comentarios -->
              <div v-else>
                <p class="no-comments">No hay comentarios aún.</p>
              </div>

              <!-- Formulario para agregar un nuevo comentario -->
              <div class="comment-form">
                <textarea v-model="newComment" class="form-control" rows="3"
                  placeholder="Escribe tu comentario aquí..."></textarea>
                <button class="btn custom-button mt-2" @click="addComment">Agregar comentario</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CharlasService from "@/services/CharlasService";
import Swal from "sweetalert2";
const serviceCharlas = new CharlasService();
import moment from 'moment';
import 'moment/locale/es';

export default {
  name: "CharlasComponent",
  data() {
    return {
      charlas: [],
      rondas: [],
      comentarios: [],
      recursos: [],
      newComment: "",
      filtroRonda: 0,
      filtroEstado: "",
      charlasFiltradas: [],
      estadosDisponibles: [],
      rolActual: "ALUMNO",
      mostrarModal: false,
      charlaSeleccionada: {},
      mostrarDescripcion: false,
      mostrarComentarios: false
    };
  }, computed: {
    rondasFiltradas() {
      // Filtra las rondas según el filtro seleccionado
      if (this.filtroRonda === 0) {
        return this.rondas;
      } else {
        return this.rondas.filter(ronda => ronda.idRonda === this.filtroRonda);
      }
    }
  },
  methods: {
    abrirModal(charla) {
      this.getDetallesCompletos(charla.idCharla);
      this.mostrarModal = true;
      this.cargarComentarios(charla.idCharla);
    },
    cerrarModal() {
      this.mostrarModal = false;
      this.charlaSeleccionada = null;
      this.mostrarDescripcion = false;
      this.mostrarComentarios = false;
    },
    cargarRondas() {
      serviceCharlas
        .getRondas()
        .then((response) => {
          this.rondas = response;
          this.cargarCharlas();
        })
        .catch((error) => {
          console.error("Error al cargar las rondas:", error);
        });
    },
    getDetallesCompletos(idCharla) {
      serviceCharlas
        .getDetallesCharla(idCharla)
        .then((data) => {
          this.charlaSeleccionada = data;
        })
        .catch((error) => {
          console.error("Error al obtener los detalles de la charla:", error);
        });
    },
    cargarCharlas() {
      serviceCharlas
        .getCharlas()
        .then((response) => {
          this.charlas = response;
          this.charlasFiltradas = this.charlas;
          this.filtrarCharlas();
          this.estadosDisponibles = [
            ...new Set(this.charlas.map((charla) => charla.estadoCharla)),
          ];
        })
        .catch((error) => {
          console.error("Error al cargar las charlas:", error);
        });
    },
    charlasPorRonda(idRonda) {
      return this.charlasFiltradas.filter(
        (charla) => charla.idRonda === idRonda
      );
    },
    //Para una página de detalles
    mostrarDetalles(idCharla) {
      this.$router.push({ name: "DetallesCharla", params: { id: idCharla } });
    },
    estadoClass(estado) {
      switch (estado) {
        case "PROPUESTA":
          return "btn btn-secondary";
        case "ACEPTADA":
          return "btn btn-success";
        case "RECHAZADA":
          return "btn btn-danger";
        default:
          return "btn btn-info";
      }
    },
    onImageError(event) {
      event.target.src = require("../assets/banner_default.jpg");
    },
    //Para la carga y creacion de comentarios
    cargarComentarios(idCharla) {
      serviceCharlas
        .getCharlasComentarios(idCharla)
        .then((response) => {
          // Formatear las fechas de los comentarios al cargar
          this.comentarios = response.comentarios.map(comentario => {
            comentario.fecha = moment(comentario.fecha).locale('es').format('DD/MM/YYYY HH:mm');
            return comentario;
          });
        })
        .catch((error) => {
          console.error("Error al cargar los comentarios:", error);
          Swal.fire("Error", "No se pudieron cargar los comentarios.", "error");
        });
    },

    // Método para agregar un nuevo comentario
    addComment() {
      // Si el comentario está vacío, no hacer nada
      if (!this.newComment.trim()) {
        return;
      }

      // Crear la fecha en formato español usando Moment.js
      const fechaActual = moment().locale('es').format('DD/MM/YYYY HH:mm'); // Formato: 23/01/2025 12:30

      const comentario = {
        idCharla: this.charlaSeleccionada.idCharla, // Usamos el id de la charla seleccionada
        idUsuario: 13, // Suponiendo que el ID de usuario es fijo para este ejemplo
        contenido: this.newComment, // Contenido del comentario
        fecha: fechaActual, // Fecha formateada en el formato deseado
      };

      this.isLoading = true; // Establecer el estado de carga mientras se crea el comentario

      serviceCharlas
        .setComentario(comentario)
        .then((response) => {
          console.log("Comentario creado:", response);
          Swal.fire({
            icon: "success",
            title: "Comentario agregado exitosamente!",
          });

          // Limpiar el campo de texto
          this.newComment = "";

          // Recargar los comentarios de la charla
          this.cargarComentarios(this.charlaSeleccionada.idCharla);

          this.isLoading = false;
        })
        .catch((error) => {
          this.isLoading = false;
          Swal.fire({
            icon: "error",
            title: "Error al agregar comentario",
            text: "No se pudo agregar el comentario. Revisa los datos enviados.",
          });
          console.error("Error al agregar el comentario:", error);
        });
    },
    obtenerTiempoRestante(ronda) {
      const ahora = new Date();
      const fechaPresentacion = new Date(ronda.fechaPresentacion);
      const fechaCierre = new Date(ronda.fechaCierre);

      if (ahora < fechaPresentacion) {
        return `🕒 ${this.formatearTiempo(fechaPresentacion - ahora)}`;
      } else if (ahora >= fechaPresentacion && ahora <= fechaCierre) {
        return `🗳️ ${this.formatearTiempo(fechaCierre - ahora)}`;
      }
      return `🔚 Finalizado`;
    },
    formatearTiempo(ms) {
      const dias = Math.floor(ms / (1000 * 60 * 60 * 24));
      const horas = Math.floor(ms % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
      const minutos = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
      if (dias !== 0) {
        return `${dias} días`;
      }
      else {
        if(horas > 10)
          return `${horas} horas ${minutos} min`;
        if (horas == 0)
          return `${minutos} min`;
        else
          return `${horas} hora ${minutos} min`;
      }
    }
  },
  mounted() {
    this.cargarRondas(); // Cargar rondas al iniciar
  }
};
</script>

<style scoped>
.flex-container {
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
}

.card-text {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-clamp: 3;
  /* Líneas que se van a mostrar */
  -webkit-line-clamp: 3;
  /* Número de líneas visibles */
  -webkit-box-orient: vertical;
  padding: 5px 0px 5px 0px;
}

.card-img-top {
  width: 100%;
  max-height: 120px;
  object-fit: cover;
}

.container {
  margin-top: 20px;
}

.card-body {
  height: 150px;
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

.modal-body {
  padding: 15px 30px 15px 30px !important;
}

.custom-buttons-container {
  display: flex;
  /* Usamos flex para alinear los botones */
  align-items: center;
  /* Centrado vertical */
  justify-content: flex-start;
  /* Alineación a la izquierda */
  gap: 15px;
  /* Espaciado entre botones */
  margin-top: 25px;
}

.custom-button {
  border-radius: 20px;
  /* Bordes redondeados */
  color: #3d3d3d;
  /* Color del texto */
  font-size: 15px;
  /* Tamaño del texto */
  font-family: "Montserrat", serif;
  /* Fuente consistente */
  font-weight: 600;
  /* Peso del texto */
  text-decoration: none;
  /* Sin subrayado */
  padding: 10px 20px;
  /* Espaciado interno */
  background-color: #f8f9fa;
  /* Fondo similar a btn-light */
  transition: background-color 0.3s ease, transform 0.2s ease;
  /* Animaciones */
  border: 1px solid #527c58;
  /* Bordes que combinan con el tema */
}

.custom-button:hover {
  background-color: #527a5899;
  border-radius: 20px;
  color: #3d3d3d;
  /* Texto blanco en hover */
  font-family: "Montserrat", serif;
  /* Fuente consistente */
  font-weight: bold;
  transition: all 0.3s ease-in-out;
}

.custom-button.active {
  background-color: #527c58;
  /* Fondo en active */
  color: #fff;
  /* Texto blanco en active */
}

.iconos {
  margin-right: 10px;
}

.modal-header {
  background-color: #7CA982;
}

.modal-title {
  font-family: "Montserrat", serif;
  /* Fuente consistente */
  font-weight: 600;
  /* Peso del texto */
}

/* Estilo para la sección de comentarios */
.custom-background {
  background-color: #f8f9fa;
  /* Fondo suave, similar a las tarjetas */
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  /* Sombra sutil para destacar */
  margin-top: 20px;
}

.custom-descripcion {
  font-size: 16px;
  color: #333;
  line-height: 1.6;
}

.comment-list {
  max-height: 200px;
  /* Ajusta la altura según sea necesario */
  overflow-y: auto;
  /* Activar scroll vertical */
  padding-right: 10px;
  /* Espacio a la derecha para evitar que el scroll se superponga */
}

.comment-item {
  background-color: #f8f9fa;
  padding: 15px;
  margin-bottom: 15px;
  list-style-type: none;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
}

.comment-item:hover {
  transform: translateY(-5px);
}

.no-comments {
  font-size: 16px;
  color: #888;
  text-align: center;
  margin-top: 10px;
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 15px;
  border: 2px solid #888;
  /* Espacio entre la imagen y el texto */
}

.username {
  font-weight: bold;
  font-size: 14px;
  color: #333;
  /* Color más oscuro para el nombre */
}

.timestamp {
  font-size: 12px;
  color: #888;
  margin-top: 5px;
}

.comment-text {
  font-size: 14px;
  color: #555;
  margin-top: 10px;
}

.no-comments {
  font-size: 16px;
  color: #888;
  text-align: center;
  margin-top: 10px;
}

/* Estilo para el formulario de agregar comentario */
.comment-form {
  margin-top: 20px;
}

.comment-form textarea {
  width: 100%;
  resize: none;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  color: #333;
  background-color: #f1f1f1;
  margin-bottom: 10px;
}

.comment-form button {
  width: 100%;
  padding: 12px;
  background-color: #527c58;
  /* Fondo del botón acorde con los otros botones */
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.comment-form button:hover {
  background-color: #406b45;
  /* Fondo más oscuro al hacer hover */
}

.accordion-button::after{
  margin-left: 28px!important;
}
</style>