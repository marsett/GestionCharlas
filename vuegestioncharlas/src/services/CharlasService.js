import axios from "axios";
import { Global } from "@/Global";
import Cookies from 'cookies-js';

export default class CharlasService {
    getRondas() {
        return new Promise((resolve, reject) => {
            const endpoint = 'api/rondas/rondascurso';
            const token = Cookies.get('bearer_token');
            axios.get(
                Global.urlBase + endpoint,
                {
                    headers: {
                        Authorization: token, 
                    }
                }
            )
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error("Error al obtener las rondas de charlas: ", error.response ? error.response.data : error);
                reject(error);
            });
        });
    }

    getCharlasAlumno(){
        return new Promise((resolve, reject) => {
            const endpoint = 'api/charlas/charlasalumno';
            const token = Cookies.get('bearer_token');
            axios.get(
                Global.urlBase + endpoint,
                {
                    headers: {
                        Authorization: token, 
                    }
                }
            )
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error("Error al obtener la charla de una ronda: ", error.response ? error.response.data : error);
                reject(error);
            });
        });
    }

    getVotosAlumno(){
        return new Promise((resolve, reject) => {
            const endpoint = 'api/votos/votosalumno';
            const token = Cookies.get('bearer_token');
            axios.get(
                Global.urlBase + endpoint,
                {
                    headers: {
                        Authorization: token, 
                    }
                }
            )
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error("Error al obtener la charla de una ronda: ", error.response ? error.response.data : error);
                reject(error);
            });
        });
    }

    getCharlas() {
        return new Promise((resolve, reject) => {
            const endpoint = 'api/charlas/charlascurso';
            const token = Cookies.get('bearer_token');
            axios.get(
                Global.urlBase + endpoint,
                {
                    headers: {
                        Authorization: token, 
                    }
                }
            )
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error("Error al obtener las charlas: ", error.response ? error.response.data : error);
                reject(error);
            });
        });
    }

    getCharlasRonda(idRonda) {
        return new Promise((resolve, reject) => {
            const endpoint = 'api/charlas/charlasronda/'+idRonda;
            const token = Cookies.get('bearer_token');
            axios.get(
                Global.urlBase + endpoint,
                {
                    headers: {
                        Authorization: token, 
                    }
                }
            )
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error("Error al obtener las charlas de una ronda: ", error.response ? error.response.data : error);
                reject(error);
            });
        });
    }

    setCharla(form){
        return new Promise((resolve, reject) => {
            const endpoint = 'api/charlas';
            const token = Cookies.get('bearer_token');
            const json = JSON.stringify({
                idCharla: 0,
                titulo: form.titulo,
                descripcion: form.descripcion,
                tiempo: form.tiempo,
                fechaPropuesta: form.fechaPropuesta+'T00:00:00',
                idUsuario: 0,
                idEstadoCharla: 1,
                idRonda: form.idRonda,
                imagenCharla: "https://static.vecteezy.com/system/resources/previews/022/555/586/non_2x/3d-abstract-red-and-black-background-by-ai-generated-can-be-use-as-facebook-cover-free-photo.jpg"
            });
            axios.post(
                Global.urlBase + endpoint,
                json,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token, 
                    }
                }
            )
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error("Error al crear el usuario:", error.response ? error.response.data : error);
                reject(error);
            });
        });
    }

    setRonda(form){
        return new Promise((resolve, reject) => {
            const token = Cookies.get('bearer_token');
            const endpoint1 = 'api/profesor/cursosprofesor';
            const endpoint2 = 'api/profesor/createronda';

            axios.get(
                Global.urlBase + endpoint1,
                {
                    headers: {
                        Authorization: token, 
                    }
                }
            )
            .then(response => {
                const json = JSON.stringify({
                    idRonda: 0, // Generado automáticamente en la API
                    idCursoUsuario: response.data[0],
                    fechaPresentacion: form.fechaPresentacion,
                    fechaCierre: form.fechaCierre,
                    duracion: form.duracion,
                    descripcionModulo: form.descripcionModulo,
                    fechaLimiteVotacion: form.fechaLimiteVotacion
                });

                axios.post(
                    Global.urlBase + endpoint2,
                    json,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: token, 
                        }
                    }
                )
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error("Error al crear ronda profesor:", error.response ? error.response.data : error);
                    reject(error);
                });
            })
            .catch(error => {
                console.error("Error al obtener el curso del profesor en la creacion de ronda: ", error.response ? error.response.data : error);
                reject(error);
            });
        });
    }

    setVoto(idRonda, idCharla){
        return new Promise((resolve, reject) => {
            const endpoint = 'api/votos';
            const token = Cookies.get('bearer_token');
            const iduser = Cookies.get('user_id');
            const json = JSON.stringify({
                idVoto: 0,
                idCharla: idCharla,
                idUsuario: iduser,
                idRonda: idRonda
            });
            
            axios.post(
                Global.urlBase + endpoint,
                json,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token, 
                    }
                }
            )
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error("Error al crear el voto:", error.response ? error.response.data : error);
                reject(error);
            });
        });
    }

    getDetallesCharla(idCharla){
        return new Promise((resolve, reject) => {
            const endpoint = 'api/charlas/'+ idCharla;
            const token = Cookies.get('bearer_token');
            axios.get(
                Global.urlBase + endpoint,
                {
                    headers: {
                        Authorization: token, 
                    }
                }
            )
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error("Error al obtener los detalles de la charla: ", error.response ? error.response.data : error);
                reject(error);
            });
        });
    }
}