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

            console.log(json)



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
}