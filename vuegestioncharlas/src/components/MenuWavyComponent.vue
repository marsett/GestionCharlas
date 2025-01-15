<template>
    <div class="container">
        <ul class="nav justify-content-end">
            <li class="nav-item" v-for="(item, index) in navItems" :key="index"
                :class="{ 'active': activeIndex === index || isActiveRoute(item) }">
                <a class="nav-link" :class="{ 'hovered': hoveredIndex === index || isActiveRoute(item) }"
                    @mouseenter="hoveredIndex = index" @mouseleave="hoveredIndex = null" @click="setActive(index)"
                    :href="item.link">{{ item.name }}</a>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            activeIndex: null,  // Indice del enlace activo
            hoveredIndex: null, // Indice del enlace con hover
            navItems: [
                { name: 'Home', link: '/' },
                { name: 'Charlas', link: '/link' },
                { name: 'Perfil', link: '/about' },
                { name: 'Cerrar Sesión', link: '/contact' }
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
li{
    margin: 5px;
}
.nav{
    margin-top: 20px;
}
/* Redondear las esquinas superiores por defecto */
.nav-link {
  border-top-left-radius: 10px; /* Redondear la esquina superior izquierda */
  border-top-right-radius: 10px; /* Redondear la esquina superior derecha */
  color: #3D3D3D;
  font-size: 18px;
}

/* Redondear las esquinas superiores en el estado hover */
.nav-link.hovered {
  background-color: #F5ECD5; /* Color de fondo al pasar el ratón */
  color: #3D3D3D; /* Color del texto cuando el ratón está encima */
}

/* Redondear las esquinas superiores en el estado active */
.nav-link.active {
  background-color: #F5ECD5; /* Color de fondo cuando está activo */
  color: #3D3D3D; /* Color del texto cuando está activo */
}


</style>