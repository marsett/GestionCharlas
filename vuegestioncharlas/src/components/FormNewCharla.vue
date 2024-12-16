<template>
  <div>
    <!-- Button trigger modal -->
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
        Subir charla
    </button>

    <!-- Modal -->
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Registrar charla</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-start">
                    <!-- Formulario -->
                    <form id="formCharla">
                        <div class="row g-3">
                        <!-- Título -->
                        <div class="col-md-12">
                            <label for="titulo" class="form-label">Título: <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="titulo" v-model="form.titulo" placeholder="Ejemplo: Innovación en tecnología educativa" required>
                        </div>
                        <!-- Descripción -->
                        <div class="col-md-12">
                            <label for="descripcion" class="form-label">Descripción: <span class="text-danger">*</span></label>
                            <textarea class="form-control" id="descripcion" v-model="form.descripcion" rows="4" placeholder="Explica brevemente el contenido y objetivos de la charla" required></textarea>
                        </div>
                        <!-- Tiempo -->
                        <div class="col-md-6">
                            <label for="tiempo" class="form-label">Duración (en minutos): <span class="text-danger">*</span></label>
                            <input type="number" class="form-control" id="tiempo" v-model="form.tiempo" placeholder="Ejemplo: 30" min="1" required>
                        </div>
                        <!-- Fecha Propuesta -->
                        <div class="col-md-6">
                            <label for="fechaPropuesta" class="form-label">Fecha propuesta: <span class="text-danger">*</span></label>
                            <input type="datetime-local" class="form-control" id="fechaPropuesta" v-model="form.fechaPropuesta" required>
                        </div>
                        <!-- ID Ronda -->
                        <div class="col-md-12">
                            <label for="idRonda" class="form-label">Ronda disponible: <span class="text-danger">*</span></label>
                            <select class="form-select" id="idRonda" v-model="form.idRonda" required>
                            <option value="" disabled selected>--- Seleccionar ---</option>
                            <option v-for="ronda in rondasDisponibles" :key="ronda.id" :value="ronda.id">
                                {{ ronda.descripcion }}
                            </option>
                            </select>
                        </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-primary" form="formCharla" @click.prevent="submitCharla">Subir</button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';

import CharlasService from '@/services/CharlasService';

const serviceChar = new CharlasService();

export default {
    data() {
        return {
            form: {
                idCharla: 0,
                titulo: "",
                descripcion: "",
                tiempo: 0,
                fechaPropuesta: "",
                idUsuario: 0,
                idEstadoCharla: 1,
                idRonda: "",
                imagenCharla: "https://static.vecteezy.com/system/resources/previews/022/555/586/non_2x/3d-abstract-red-and-black-background-by-ai-generated-can-be-use-as-facebook-cover-free-photo.jpg"
            },
            rondasDisponibles: [
                { id: 1, descripcion: "Ronda 1" },
                { id: 2, descripcion: "Ronda 2" }
            ],
        };
    },
    mounted(){
        serviceChar.getRondas()
        .then(response => {
            const rondas = response;
            const fechaActual = new Date();

            // Filtrar rondas abiertas antes de la fecha de cierre
            this.rondasDisponibles = rondas
            .filter(ronda => new Date(ronda.fechaCierre) > fechaActual)
            .map(ronda => ({
                id: ronda.idRonda,
                descripcion: ronda.descripcionModulo
            }));

            // Obtener las charlas del alumno
            serviceChar.getCharlasAlumno()
            .then(charlasResponse => {
                this.rondasDisponibles.forEach(ronda => {
                    ronda.puedeSubirCharla = this.puedeSubirCharlaEnRonda(ronda, charlasResponse);
                });

                // Filtrar solo las rondas donde el alumno pueda subir una charla
                this.rondasDisponibles = this.rondasDisponibles.filter(ronda => ronda.puedeSubirCharla);
            })
            .catch(error => {
                console.error("Error al obtener las charlas del alumno en new charla:", error);
            });
        })
        .catch(error => {
            console.error('Error al obtener las rondas de charlas en new charla:', error);
        });
    },
    methods: {
        puedeSubirCharlaEnRonda(ronda, charlas) {
            const charlasEnRonda = charlas.filter(charla => charla.charla.idRonda === ronda.id);
            return charlasEnRonda.length === 0 ? true : false;
        },
        isValidForm() {
            return (
                this.form.titulo.trim() &&
                this.form.descripcion.trim() &&
                this.form.tiempo > 0 &&
                this.form.fechaPropuesta &&
                this.form.idRonda
            );
        },
        submitCharla() {
            if (!this.isValidForm()) {
                Swal.fire({
                    icon: "error",
                    title: "Campos incompletos",
                    text: "Por favor, asegúrate de rellenar los campos obligatorios.",
                });
                return;
            } 

            console.log("Formulario enviado:", this.form);
                alert("Charla registrada con éxito.");
        }
    }
}
</script>

<style scoped>

</style>