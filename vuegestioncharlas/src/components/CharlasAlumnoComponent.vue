<template>
  <MenuComponent />
  <div class="container mt-5">
    <h1 class="text-center mb-4">Charlas Alumno</h1>
    
    <div v-for="charla in charlas" :key="charla.charla.idCharla" class="card mb-4">
      <div class="card-header d-flex justify-content-between">
        <h5>{{ charla.charla.titulo }}</h5>
        <small class="text-muted">Fecha propuesta: {{ formatDate(charla.charla.fechaPropuesta) }}</small>
      </div>
      <div class="card-body">
        <p><strong>Estado:</strong> {{ charla.charla.estadoCharla }}</p>
        <p><strong>Curso:</strong> {{ charla.charla.nombreCurso }}</p>
        <p><strong>Duración:</strong> {{ charla.charla.tiempo }} minutos</p>

        <button v-if="!charla.showDetails" @click="charla.showDetails = true" class="btn btn-primary mt-3">Ver Detalles</button>

        <div v-if="charla.showDetails">
          <p><strong>Descripción:</strong> {{ charla.charla.descripcion }}</p>

          <h6>Recursos:</h6>
          <ul>
            <li v-for="recurso in charla.recursos" :key="recurso.idRecurso">
              <a :href="recurso.url" target="_blank">{{ recurso.nombre }}</a>: {{ recurso.descripcion }}
            </li>
          </ul>

          <h6>Comentarios:</h6>
          <div v-for="comentario in charla.comentarios" :key="comentario.idComentario" class="mb-2">
            <p><strong>{{ comentario.usuario }}:</strong> {{ comentario.contenido }}</p>
            <small class="text-muted">{{ formatDate(comentario.fecha) }}</small>
          </div>

          <button @click="charla.showDetails = false" class="btn btn-secondary mt-3">Ocultar Detalles</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MenuComponent from './MenuComponent.vue';

export default {
  name: "CharlasAlumnoComponent",
  components: {
    MenuComponent
  },
  data() {
    return {
      charlas: [
        {
          charla: {
            idCharla: 1,
            titulo: "Introducción a Vue.js",
            descripcion: "Charla introductoria sobre Vue.js, sus características y ventajas.",
            tiempo: 60,
            fechaPropuesta: "2024-12-11T18:12:31.767Z",
            idUsuario: 2,
            usuario: "Juan Pérez",
            idEstadoCharla: 1,
            estadoCharla: "Finalizada",
            idRonda: 3,
            idCurso: 101,
            nombreCurso: "Desarrollo Web"
          },
          comentarios: [
            {
              idComentario: 1,
              idCharla: 1,
              idUsuario: 2,
              contenido: "Muy interesante la charla, me ayudó a entender mejor Vue.",
              fecha: "2024-12-11T19:00:00.000Z"
            },
            {
              idComentario: 2,
              idCharla: 1,
              idUsuario: 3,
              contenido: "Genial, la explicación fue clara y concisa.",
              fecha: "2024-12-11T20:00:00.000Z"
            },
            {
              idComentario: 3,
              idCharla: 1,
              idUsuario: 4,
              contenido: "Me gustaría saber más sobre los casos prácticos.",
              fecha: "2024-12-12T09:00:00.000Z"
            }
          ],
          recursos: [
            {
              idRecurso: 1,
              idCharla: 1,
              url: "https://vuejs.org",
              nombre: "Documentación oficial",
              descripcion: "Enlace a la documentación oficial de Vue.js"
            }
          ],
          showDetails: false
        },
        {
          charla: {
            idCharla: 2,
            titulo: "Fundamentos de JavaScript",
            descripcion: "Explorando los conceptos básicos de JavaScript.",
            tiempo: 45,
            fechaPropuesta: "2024-12-12T14:30:00.000Z",
            idUsuario: 3,
            usuario: "Ana López",
            idEstadoCharla: 2,
            estadoCharla: "Finalizada",
            idRonda: 2,
            idCurso: 102,
            nombreCurso: "Desarrollo Web"
          },
          comentarios: [
            {
              idComentario: 1,
              idCharla: 2,
              idUsuario: 3,
              contenido: "Excelente charla para comenzar con JavaScript.",
              fecha: "2024-12-12T15:00:00.000Z"
            },
            {
              idComentario: 2,
              idCharla: 2,
              idUsuario: 4,
              contenido: "Fue un buen repaso de los fundamentos.",
              fecha: "2024-12-12T16:00:00.000Z"
            },
            {
              idComentario: 3,
              idCharla: 2,
              idUsuario: 5,
              contenido: "Me quedó claro el concepto de funciones. ¡Gracias!",
              fecha: "2024-12-12T17:00:00.000Z"
            },
            {
              idComentario: 4,
              idCharla: 2,
              idUsuario: 6,
              contenido: "Recomiendo practicar más ejercicios para afianzar el aprendizaje.",
              fecha: "2024-12-12T18:00:00.000Z"
            }
          ],
          recursos: [
            {
              idRecurso: 2,
              idCharla: 2,
              url: "https://developer.mozilla.org/es/docs/Web/JavaScript",
              nombre: "MDN - JavaScript",
              descripcion: "Enlace a la documentación de JavaScript en MDN"
            }
          ],
          showDetails: false
        }
      ]
    };
  },
  methods: {
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
      return new Date(date).toLocaleDateString('es-ES', options);
    }
  }
};
</script>

<style scoped>
.card {
  background-color: #f8f9fa;
}

.card-header {
  background-color: #007bff;
  color: white;
}

.card-body {
  background-color: #ffffff;
}

h6 {
  color: #007bff;
}

.btn-primary {
  font-size: 1.1em;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  font-size: 1.1em;
}

.btn-secondary:hover {
  background-color: #6c757d;
}

ul {
  padding-left: 20px;
}

ul li {
  list-style-type: disc;
}

@media (max-width: 768px) {
  .card-body {
    padding: 15px;
  }
  .btn-primary {
    width: 100%;
  }
}
</style>
