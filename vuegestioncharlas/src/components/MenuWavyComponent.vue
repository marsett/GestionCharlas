<template>
<div class="nav">
    <div class="container d-flex align-items-center justify-content-between">
        <!-- Logo a la izquierda -->
        <div class="logo-container">
            <img src="../assets/logo-tajamar.png" alt="logo tajamar" class="logo_tajamar">
        </div>

        <!-- Links centrados -->
        <ul class="nav nav-custom justify-content-center m-0">
            <li class="nav-item" v-for="(item, index) in navItems" :key="index"
                :class="{ 'active': activeIndex === index || isActiveRoute(item) }">
                <a class="nav-link" :class="{ 'hovered': hoveredIndex === index || isActiveRoute(item) }"
                    @mouseenter="hoveredIndex = index" @mouseleave="hoveredIndex = null" @click="setActive(index)"
                    :href="item.link">
                    <i :class="item.icon"></i>
                    {{ item.name }}
                </a>
            </li>
        </ul>

        <!-- Círculo de imagen de perfil a la derecha -->
         <div class="profile-container">
             <div class="profile-circle ">
                 <img src="../assets/perfil_prueba.png" alt="profile" class="img-fluid rounded-circle">
            </div>
            <h2 class="profile-name">NOMBRE</h2>
         </div>
    </div>
</div>

</template>

<script>
export default {
    data() {
        return {
            activeIndex: null,  // Indice del enlace activo
            hoveredIndex: null, // Indice del enlace con hover
            navItems: [
            { name: 'Home', link: '/', icon: 'fa-solid fa-house' },
            { name: 'Charlas', link: '/charlas', icon: 'fa-solid fa-comments' }
            ] // Elementos del menú con enlaces
        };
    },
    methods: {
        setActive(index) {
            this.activeIndex = index; // Establecer el índice activo
        },
        isActiveRoute(item) {
            return this.$route.path === item.link; // Verifica si la ruta actual es la del enlace
        }
    }
};
</script>

<style scoped>
/* Contenedor principal del nav */
.nav {
    position: relative;
    padding: 50px;
    background-image: radial-gradient(circle, #A8D1AC, #7CA982);
    box-shadow: 0px 3px 12px rgba(0, 0, 0, .5);
}

/* Contenedor interno con flex */
.container {
    display: flex;
    align-items: center;
    justify-content: space-between; /* Distribuye los elementos */
    position: relative;
}

/* Logo a la izquierda */
.logo-container {
    position: absolute;
    left: 20px; /* Ajusta la distancia desde el borde izquierdo */
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
}

.logo_tajamar {
    height: 50px;
    object-fit: contain;
}

/* Menú de links centrado */
.nav-custom {
    position: absolute;
    left: 50%;
    transform: translateX(-50%); /* Centrado horizontal */
    margin: 0; /* Sin margen para evitar desplazamientos */
    display: flex;
    gap: 15px; /* Espaciado entre los enlaces */
    list-style: none;
    background-image: none !important;
    box-shadow: none !important;
    
}

/* Links del menú */
.nav-link {
    border-radius: 20px;
    color: #3D3D3D;
    font-size: 18px;
    font-family: "Montserrat", serif;
    font-weight: semibold;
    text-decoration: none;
}

/* Estado hover */
.nav-link.hovered {
    background-color: rgba(82, 124, 88, 60%);
    color: #3D3D3D;
    transition-delay: 0.1s;
}

/* Estado activo */
.nav-link.active {
    background-color: #527C58;
    font-size: 20px;
    color: #3D3D3D;
}
.nav-link{
    font-family: "Montserrat", serif;
  font-optical-sizing: auto;
  font-weight: 600;
  font-style: normal;
}

/* Contenedor del perfil a la derecha */
.profile-container {
    position: absolute;
    right: 20px; /* Ajusta la distancia desde el borde derecho */
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center; /* Alinea verticalmente imagen y texto */
    gap: 10px; /* Espaciado entre la imagen y el nombre */
}

/* Círculo para la imagen de perfil */
.profile-circle {
    width: 70px;
    height: 70px;
    overflow: hidden;
    border: 2px solid #3D3D3D;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white
}

/* Imagen dentro del círculo */
.profile-circle img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Estilo del nombre del usuario */
.profile-name {
    margin: 0;
    font-size: 18px;
    font-family: "Montserrat", serif;
    font-weight: bold;
    color: #3D3D3D;
    white-space: nowrap;
}

</style>