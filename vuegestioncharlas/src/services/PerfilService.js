import axios from "axios";
import { Global } from "@/Global";
import Cookies from 'cookies-js';

export default class PerfilService {
    getUsuarioPerfil() {
        return new Promise((resolve, reject) => {
            const endpoint = "api/usuarios/perfil";
            const token = Cookies.get('bearer_token');

            axios.get(Global.urlBase + endpoint, {
                headers: {
                    Authorization: token, // Incluye el token recuperado
                },
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error("Error al obtener el perfil:", error.response ? error.response.data : error);
                    reject(error);
                });
        });
    }
    // Método para obtener las charlas del usuario
    getCharlasUsuario() {
        return new Promise((resolve, reject) => {
            const endpoint = "api/Charlas/CharlasUser";
            const token = Cookies.get('bearer_token'); // Obtenemos el token

            axios.get(Global.urlBase + endpoint, {
                headers: {
                    Authorization: token, // Incluye el token en el header
                },
            })
                .then(response => {
                    resolve(response.data); // Retorna las charlas
                })
                .catch(error => {
                    console.error("Error al obtener las charlas:", error.response ? error.response.data : error);
                    reject(error);
                });
        });
    }
}