import { createRouter, createWebHistory } from "vue-router";
import Cookies from 'cookies-js';
import HomeComponent from './components/HomeComponent.vue';
import LoginComponent from './components/LoginComponent.vue';
import PerfilAlumnoComponent from './components/PerfilAlumnoComponent.vue';
import PerfilProfesorComponent from './components/PerfilProfesorComponent.vue';
import CharlasComponent from './components/CharlasComponent.vue';
import CharlasAlumnoComponent from './components/CharlasAlumnoComponent.vue';
import AdminGestionUsuariosComponent from "@/components/AdminGestionUsuariosComponent";
import AdminGestionProfesoresComponent from "@/components/AdminGestionProfesoresComponent";
import NotFoundComponent from "./components/NotFoundComponent.vue";

const routes = [
    {
        path: '/login',
        component: LoginComponent,
        beforeEnter: (to, from, next) => {
            const token = Cookies.get('bearer_token'); // Verifica si la cookie 'bearer_token' existe
            if (!token) {
                next(); // Si no tiene token, accede a la página de login
            } else {
                next('/'); // Si tiene token, redirige al Home
            }
        }
    },
    {
        path: '/',
        component: HomeComponent,
        beforeEnter: (to, from, next) => {
            const token = Cookies.get('bearer_token');  // Obtiene el token desde la cookie
            if (token) {
                next(); // Si tiene token, permite el acceso
            } else {
                next('/login'); // Si no tiene token, redirige a la página de login
            }
        }
    },
    {
        path: '/perfilalumno',
        component: PerfilAlumnoComponent,
        beforeEnter: (to, from, next) => {
            const token = Cookies.get('bearer_token');
            if (token) {
                next(); 
            } else {
                next('/login');
            }
        }
    },
    {
        path: '/perfilprofesor',
        component: PerfilProfesorComponent,
        beforeEnter: (to, from, next) => {
            const token = Cookies.get('bearer_token');
            if (token) {
                next(); 
            } else {
                next('/login');
            }
        }
    },
    {
        path: '/charlas',
        component: CharlasComponent,
        beforeEnter: (to, from, next) => {
            const token = Cookies.get('bearer_token');
            if (token) {
                next(); 
            } else {
                next('/login');
            }
        }
    },
    {
        path: '/charlasalumno',
        component: CharlasAlumnoComponent,
        beforeEnter: (to, from, next) => {
            const token = Cookies.get('bearer_token');
            if (token) {
                next(); 
            } else {
                next('/login');
            }
        }
    },
    {
    path: '/gestionusuarios',
        component: AdminGestionUsuariosComponent,
        beforeEnter: (to, from, next) => {
            const token = Cookies.get('bearer_token');
            if (token) {
                next(); 
            } else {
                next('/login');
            }
        }
    },
    {
        path: '/gestionprofesores',
        component: AdminGestionProfesoresComponent,
        beforeEnter: (to, from, next) => {
            const token = Cookies.get('bearer_token');
            if (token) {
                next(); 
            } else {
                next('/login');
            }
        }
    },
    // Ruta catch-all para manejar Not Found
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFoundComponent
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

export default router;