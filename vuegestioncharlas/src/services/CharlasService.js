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
            const endpoint = 'api/charlas';
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
}