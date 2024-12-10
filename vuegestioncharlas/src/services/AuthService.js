import axios from "axios";
import { Global } from "@/Global";

export default class AuthService {
    getToken(userName, password) {
        return new Promise((resolve, reject) => {
            const endpoint = 'api/auth/login';
            axios.post(
                Global.urlBase + endpoint,
                JSON.stringify({
                    userName,
                    password
                }),
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
                reject(error);
            });
        });
    }
}