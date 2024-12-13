import axios from "axios";
import { Global } from "@/Global";

export default class AuthService {
    getToken(userName, password) {
        return new Promise((resolve, reject) => {
            const endpoint = 'api/auth/login';
            const json = JSON.stringify({
                userName,
                password
            });
            axios.post(
                Global.urlBase + endpoint,
                json,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            )
            .then(response => {
                resolve(response.data.response);
            })
            .catch(error => {
                console.error("Error al obtener el token:", error.response ? error.response.data : error);
                reject(error);
            });
        });
    }

    setUser(form){
        return new Promise((resolve, reject) => {
            const endpoint = 'api/usuarios/newalumno/'+form.idCurso;
            const json = JSON.stringify({
                idUsuario: form.idUsuario,
                nombre: form.nombre,
                apellidos: form.apellidos,
                email: form.email,
                estadoUsuario: form.estadoUsuario,
                imagen: form.imagen,
                password: form.password,
                idRole: form.idRole
            });
            axios.post(
                Global.urlBase + endpoint,
                json,
                {
                    headers: {
                        'Content-Type': 'application/json',
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

    getRoles(){
        return new Promise((resolve, reject) => {
            const endpoint = 'api/roles';
            axios.get(
                Global.urlBase + endpoint
            )
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error("Error al obtener los roles: ", error.response ? error.response.data : error);
                reject(error);
            });
        });
    }

    getCursos(){
        return new Promise((resolve, reject) => {
            const endpoint = 'api/cursos';
            axios.get(
                Global.urlBase + endpoint
            )
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error("Error al obtener los cursos: ", error.response ? error.response.data : error);
                reject(error);
            });
        });
    }
}