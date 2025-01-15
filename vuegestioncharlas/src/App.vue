<template>
  <MenuWavyComponent v-if="isLoggedIn && userRole === 'ALUMNO'" />
  <MenuComponentProfesor v-if="isLoggedIn && userRole === 'PROFESOR'" />
  <MenuComponentAdmin v-if="isLoggedIn && userRole === 'ADMINISTRADOR'" />
  <router-view></router-view>
</template>

<script>
import Cookies from "cookies-js";
import MenuComponentProfesor from "./components/MenuComponentProfesor.vue";
import MenuComponentAdmin from "./components/MenuComponentAdmin.vue";
import MenuWavyComponent from "./components/MenuWavyComponent.vue";

export default {
  name: "App",
  components: {
    MenuWavyComponent,
    MenuComponentProfesor,
    MenuComponentAdmin,

  },
  data() {
    return {
      isLoggedIn: false,
      userRole: null,
    };
  },
  watch: {
    // Observamos los cambios en la ruta para verificar login
    $route() {
      this.checkAuthentication();
    },
  },
  created() {
    // Llamamos al método para comprobar si el usuario está autenticado
    this.checkAuthentication();
  },
  methods: {
    checkAuthentication() {
      const token = Cookies.get("bearer_token");
      const role = Cookies.get("user_role");
      this.isLoggedIn = !!token; // Determina si el usuario está logueado
      this.userRole = role;
    },
  },
};
</script>

<style>
</style>
