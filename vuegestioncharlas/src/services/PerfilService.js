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
}