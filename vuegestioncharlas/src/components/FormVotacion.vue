<template>
    <div class="d-inline">
        <!-- Botón para abrir el modal -->
        <button type="button" class="btn btn-primary ms-1" data-bs-toggle="modal" data-bs-target="#votarModal">
            Votar Charla
        </button>
  
        <!-- Modal para votar charla -->
        <div class="modal fade" id="votarModal" tabindex="-1" aria-labelledby="votarModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="votarModalLabel">Votar Charla</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <!-- Formulario de voto -->
                    <form id="formCharla" @submit.prevent="submitVote">
                        <div class="row g-3">
                            <!-- ID Ronda -->
                            <div class="col-md-12">
                                <label for="idRonda" class="form-label">Rondas disponibles: <span class="text-danger">*</span></label>
                                <select class="form-select" v-model="form.idRonda" required>
                                    <option value="" disabled selected>--- Seleccionar ronda ---</option>
                                    <option v-for="ronda in rondasDisponibles" :key="ronda.id" :value="ronda.id">
                                    {{ ronda.descripcion }}
                                    </option>
                                </select>
                            </div>

                            <!-- ID Charla -->
                            <div class="col-md-12">
                                <label for="idCharla" class="form-label">Charlas por ronda: <span class="text-danger">*</span></label>       
                                <select class="form-select" v-model="form.idCharla" required>
                                    <option value="" disabled selected> 
                                        <!-- Si no hay ronda seleccionada, muestra un mensaje indicativo -->
                                        {{ form.idRonda === "" ? 'Seleccionar una ronda primero' : '--- Seleccionar charla ---' }}
                                    </option>
                                    <template v-if="form.idRonda">
                                        <!-- Mostrar opciones de charla solo si hay una ronda seleccionada -->
                                        <option v-for="charla in charlasDisponibles" :key="charla.id" :value="charla.id">
                                        {{ charla.titulo }}
                                        </option>
                                    </template>
                                </select>
                            </div>


                        </div>

                        <!-- Botón para votar -->
                        <button type="reset" class="btn btn-secondary mt-3 me-1" @click="clearForm()">Cancelar</button>
                        <button type="submit" class="btn btn-primary mt-3 ms-1">Votar</button>
                    </form>
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
                idVoto: 0,
                idCharla: "",
                idUsuario: 0,
                idRonda: ""
            },
            rondasDisponibles: [],
            charlasDisponibles: [
                { id: 1, titulo: 'Charla 1: El futuro de la educación' },
                { id: 2, titulo: 'Charla 2: Tecnología y sostenibilidad' },
                { id: 3, titulo: 'Charla 3: Inteligencia artificial en medicina' }
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
                descripcion: ronda.descripcionModulo,
                fechaPresentacion: ronda.fechaPresentacion,
                tiempo: ronda.duracion
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
        submitVote() {
            console.log("Voto enviado con los siguientes datos:", this.form);
            // Aquí se realizaría una petición HTTP para enviar los datos del formulario al servidor
            // Por ejemplo: axios.post('/votar-charla', this.form)
        },
        puedeSubirCharlaEnRonda(ronda, charlas) {
            const charlasEnRonda = charlas.filter(charla => charla.charla.idRonda === ronda.id);
            return charlasEnRonda.length === 0 ? true : false;
        },
        getCurrentDate() {
            const today = new Date();
            const year = today.getFullYear();
            const month = ("0" + (today.getMonth() + 1)).slice(-2); 
            const day = ("0" + today.getDate()).slice(-2);
            return `${year}-${month}-${day}`;
        },
        isValidForm() {
            return (
                this.form.titulo.trim() !== "" &&
                this.form.descripcion.trim() !== "" &&
                this.form.tiempo > 0 &&
                this.form.fechaPropuesta !== "" &&
                this.form.idRonda !== ""
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

            serviceChar.setCharla(this.form)
            .then(response => {
                response
                Swal.fire({
                    title: "Charla registrada con éxito!",
                    icon: "success",
                    draggable: true
                })
                .then(() => {
                    document.getElementById('cancelarFormNew').click();
                    this.$emit('evaluarRondas');
                });
            })
            .catch(error => {
                console.error('Error al crear una charla:', error);
                Swal.fire({
                    icon: "error",
                    title: "No se pudo crear la charla",
                    text: "Hubo un problema al intentar crear la charla. Por favor, inténtalo de nuevo más tarde.",
                });
            });
        },
        clearForm() {
            this.form = {
                idCharla: "",
                idRonda: ""
            };
        },
        changeRangeMax(){
            if (this.form.idRonda) {
                // Encuentra la ronda seleccionada
                const rondaSeleccionada = this.rondasDisponibles.find(ronda => ronda.id === this.form.idRonda);

                // Actualiza maxTiempo basado en la ronda seleccionada
                if (rondaSeleccionada) {
                    console.log(rondaSeleccionada);
                    this.maxTiempo = rondaSeleccionada.tiempo;
                    this.form.tiempo = 0;
                } else {
                    this.form.tiempo = 0;
                    this.maxTiempo = 0; // Valor predeterminado si no encuentra la ronda
                }
            } else {
                this.form.tiempo = 0;
                this.maxTiempo = 0;
            }
        }
    }
}
</script>

<style scoped>
    .modal {
        --bs-modal-border-color: none;
    }

    .modal-header{
        background-color: #578e73;
        color: white;
    }

    label{
        display: block;
        text-align: left;
    }
</style>