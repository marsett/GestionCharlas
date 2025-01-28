<template>
  <!-- Botón con un spinner mientras se actualizan los estados -->
  <button class="btn btn-mover mt-2" @click.prevent="actualizarEstados" :disabled="cargando">
    <span v-if="cargando" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    <span v-else>Actualizar estados</span>
  </button>
</template>

<script>
import CharlasService from "@/services/CharlasService";
import Swal from 'sweetalert2';

export default {
    data() {
        return {
            serviceChar: new CharlasService(),
            cargando: false,
        };
    },
    methods: {
        async actualizarEstados() {
            try {
                this.cargando = true;

                // Paso 1: Obtener rondas activas
                const rondas = await this.serviceChar.getRondas();

                const fechaActual = new Date();
                const rondasActivas = rondas.filter((ronda) => {
                    const fechaPresentacion = new Date(ronda.fechaPresentacion);
                    const fechaLimiteVotacion = new Date(ronda.fechaLimiteVotacion);
                    return fechaActual < fechaPresentacion && fechaActual > fechaLimiteVotacion;
                });

                // Verificar si no hay rondas activas
                if (rondasActivas.length === 0) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No hay rondas activas',
                        text: 'No hay rondas disponibles para actualizar los estados.',
                        confirmButtonText: 'Aceptar'
                    });
                    return; 
                }

                // Paso 2: Procesar cada ronda activa
                for (const ronda of rondasActivas) {
                    const idRonda = ronda.idRonda;
                    let duracionDisponible = ronda.duracion;

                    // Obtener votos por ronda
                    const votosData  = await this.serviceChar.getVotosRonda(idRonda);
                    const votos = votosData.votos; 

                    // Obtener las charlas más votadas
                    const charlasMasVotadas = votos
                        .sort((a, b) => b.votos - a.votos) // Ordenar de mayor a menor por cantidad
                        .slice(0, 4) // Tomar las 3 o 4 más votadas
                        .map((charla) => charla.idCharla); // Extraer solo los idCharla

                    // Paso 3: Obtener charlas de la ronda
                    const charlas = await this.serviceChar.getCharlasRonda(idRonda);

                    // Seleccionar charlas más votadas que entren en el tiempo disponible
                    const charlasSeleccionadas = [];

                    for (const idCharla of charlasMasVotadas) {
                        const charla = charlas.find((c) => c.idCharla === idCharla);

                        // Si la charla existe y su duración no excede la duración disponible
                        if (charla) {
                            if (charla.tiempo <= duracionDisponible) {
                                charlasSeleccionadas.push({
                                    idCharla: charla.idCharla,
                                    idEstadoCharla: 2, // Estado "Aceptada"
                                });
                                duracionDisponible -= charla.tiempo; // Reducir la duración disponible
                            } 
                        } 
                    }

                    // Verificar si no hay charlas seleccionadas
                    if (charlasSeleccionadas.length === 0) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'No se seleccionaron charlas',
                            text: 'No hay charlas que cumplan con la duración disponible para ser actualizadas.',
                            confirmButtonText: 'Aceptar'
                        });
                        return; 
                    }

                    // Paso 4: Actualizar estado de las charlas seleccionadas
                    for (const charla of charlasSeleccionadas) {
                        await this.serviceChar.updateEstadoCharla(charla.idCharla, charla.idEstadoCharla);
                    }
                }

                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Estados actualizados",
                    showConfirmButton: false,
                    timer: 2000
                });
            } catch (error) {
                console.error("Error al actualizar estados:", error);

                Swal.fire({
                    icon: 'error',
                    title: 'Ocurrió un error al actualizar los estados',
                    text: 'Revisa la consola para más detalles.',
                    confirmButtonText: 'Aceptar'
                });
            }
            finally {
                // Desactivar el spinner al finalizar
                this.cargando = false;
            }
        },
    },
};
</script>

<style>
/* Estilo opcional */
.btn {
  margin-top: 20px;
}
</style>
