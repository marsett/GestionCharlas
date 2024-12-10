import { createRouter, createWebHistory } from "vue-router";
// import Cookies from 'cookies-js';
import HomeComponent from './components/HomeComponent.vue';
import LoginComponent from './components/LoginComponent.vue';
import PerfilAlumnoComponent from './components/PerfilAlumnoComponent.vue';

const routes = [
    {
        path: '/',
        component: HomeComponent,
        // beforeEnter: (to, from, next) => {
        //     const token = Cookies.get('bearer_token');  // Obtiene el token desde la cookie
        //     if (token) {
        //         next(); // Si tiene token, permite el acceso
        //     } else {
        //         next('/login'); // Si no tiene token, redirige a la página de login
        //     }
        // }
    },
    {
        path: '/login',
        component: LoginComponent,
        // beforeEnter: (to, from, next) => {
        //     const token = Cookies.get('bearer_token'); // Verifica si la cookie 'bearer_token' existe
        //     if (!token) {
        //         next(); // Si no tiene token, accede a la página de login
        //     } else {
        //         next('/'); // Si tiene token, redirige al Home
        //     }
        // }
    },
    {
        path: '/perfilalumno',
        component: PerfilAlumnoComponent,
        // beforeEnter: (to, from, next) => {
        //     const token = Cookies.get('bearer_token'); // Verifica si la cookie 'bearer_token' existe
        //     if (!token) {
        //         next(); // Si no tiene token, accede a la página de login
        //     } else {
        //         next('/'); // Si tiene token, redirige al Home
        //     }
        // }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

export default router;