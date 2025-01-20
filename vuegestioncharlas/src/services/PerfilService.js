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
            const endpoint = "api/Charlas/CharlasAlumno";
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

    
    uploadUserImage(userId, fileName, fileContent) {
        return new Promise((resolve, reject) => {
            const endpoint = `api/Files/UploadImagenUsuario/${userId}`;
            const token = Cookies.get('bearer_token');
    
            axios.post(Global.urlBase + endpoint, {
                fileName,
                fileContent,
            }, {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error("Error al subir la imagen:", error.response ? error.response.data : error);
                    reject(error);
                });
        });
    }
    
    editarPerfil(usuario) {
        return new Promise((resolve, reject) => {
            const endpoint = "api/Usuarios";
            const token = Cookies.get('bearer_token');
    
            const payload = {
                idUsuario: usuario.idUsuario,
                nombre: usuario.nombre,
                apellidos: usuario.apellidos,
                email: usuario.email,
                estadoUsuario: usuario.estadoUsuario,
                imagen: usuario.imagen,
                password: usuario.password,
                idRole: usuario.idRole,
            };
    
            axios.put(Global.urlBase + endpoint, payload, {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            })
                .then(response => {
                    resolve(response.data); 
                })
                .catch(error => {
                    console.error("Error al editar el perfil:", error.response ? error.response.data : error);
                    reject(error); 
                });
        });
    }
      getRondasProfesor() {
        return axios.get(Global.urlBase + "api/Profesor/RondasProfesor", {
            headers: { Authorization: Cookies.get("bearer_token") },
        }).then(response => response.data);
    }

    getAlumnosCursoProfesor() {
        return new Promise((resolve, reject) => {
            const endpoint = "api/Profesor/AlumnosCursoProfesor";
            const token = Cookies.get('bearer_token'); 

            axios.get(Global.urlBase + endpoint, {
                headers: {
                    Authorization: token, 
                },
            })
            .then(response => {
                resolve(response.data); 
            })
            .catch(error => {
                console.error("Error al obtener los alumnos de un profesor:", error.response ? error.response.data : error);
                reject(error);
            });
        });
    }

    updateEstadoUsuario(idUsuario, estado) {
        return new Promise((resolve, reject) => {
            const endpoint = `/api/profesor/updateestadoalumno/${idUsuario}/${estado}`;
            const token = Cookies.get('bearer_token'); 

            axios.put(Global.urlBase + endpoint, {}, {
                headers: {
                    Authorization: token, 
                },
            })
            .then(response => {
                resolve(response.data); 
            })
            .catch(error => {
                console.error("Error al actualizar el estado del usuario:", error);
                reject(error);
            });
        });
    }
    updateContrasenia(nuevacontrasenia) {
        return new Promise((resolve, reject) => {
            const endpoint = `/api/usuarios/updatepasswordusuario`;
            const token = Cookies.get('bearer_token'); 

            const passwordnew = {
                newPassword: nuevacontrasenia
            };
            axios.put(Global.urlBase + endpoint, passwordnew, {
                headers: {
                    Authorization: token, 
                },
            })
            .then(response => {
                resolve(response.data); 
            })
            .catch(error => {
                console.error("Error al actualizar el estado del usuario:", error);
                reject(error);
            });
        });
    } 
    
    
}
