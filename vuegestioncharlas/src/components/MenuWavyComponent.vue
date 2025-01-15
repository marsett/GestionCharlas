<template>
    <div class="container">
        <ul class="nav justify-content-end">
            <li class="nav-item" v-for="(item, index) in navItems" :key="index"
                :class="{ 'active': activeIndex === index || isActiveRoute(item) }">
                <a 
                    v-if="item.name === 'Cerrar Sesión'" 
                    class="nav-link"
                    :class="{ 'hovered': hoveredIndex === index }"
                    @mouseenter="hoveredIndex = index" 
                    @mouseleave="hoveredIndex = null" 
                    @click="logout"
                >
                    <i :class="item.icon"></i>
                    {{ item.name }}
                </a>
                <a 
                    v-else 
                    class="nav-link"
                    :class="{ 'hovered': hoveredIndex === index || isActiveRoute(item) }"
                    @mouseenter="hoveredIndex = index" 
                    @mouseleave="hoveredIndex = null" 
                    @click="setActive(index)"
                    :href="item.link"
                >
                    <i :class="item.icon"></i>
                    {{ item.name }}
                </a>
            </li>
        </ul>
    </div>
</template>


<script>
import Cookies from 'cookies-js';
import Swal from 'sweetalert2';

export default {
    data() {
        return {
            activeIndex: null,  // Indice del enlace activo
            hoveredIndex: null, // Indice del enlace con hover
            navItems: [
                { name: 'Home', link: '/', icon: 'fa-solid fa-house' },
                { name: 'Charlas', link: '/charlas', icon: 'fa-solid fa-comments' },
                { name: 'Perfil', link: '/perfilalumno', icon: 'fa-solid fa-user-circle' },
                { name: 'Cerrar Sesión', link: '/cerrarsesión', icon: 'fa-solid fa-sign-out-alt' },
            ] // Elementos del menú con enlaces
        };
    },
    methods: {
        setActive(index) {
            this.activeIndex = index; // Establecer el índice activo
        },
        isActiveRoute(item) {
            return this.$route.path === item.link; // Verifica si la ruta actual es la del enlace
        },
        logout() {
            Swal.fire({
                title: "¿Quieres cerrar la sesión?",
                text: "Una vez cerrada, para volver a acceder al contenido, necesitarás iniciar sesión de nuevo.",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Cerrar sesión",
                cancelButtonText: "Cancelar"
            }).then((result) => {
                if (result.isConfirmed) {
                    Cookies.expire('bearer_token');
                    this.$router.push('/login');
                }
            });
        },
    },
};
</script>

<style scoped>
li {
    margin: 0 8px 0px 0;
}

.nav {
    margin-top: 20px;
}

/* Redondear las esquinas superiores por defecto */
.nav-link {
    border-top-left-radius: 10px;
    /* Redondear la esquina superior izquierda */
    border-top-right-radius: 10px;
    /* Redondear la esquina superior derecha */
    color: #3D3D3D;
    font-size: 18px;
}

/* Redondear las esquinas superiores en el estado hover */
.nav-link.hovered {
    background-color: #F5ECD5;
    /* Color de fondo al pasar el ratón */
    color: #3D3D3D;
    /* Color del texto cuando el ratón está encima */
}

/* Redondear las esquinas superiores en el estado active */
.nav-link.active {
    background-color: #F5ECD5;
    /* Color de fondo cuando está activo */
    color: #3D3D3D;
    /* Color del texto cuando está activo */
}
</style>