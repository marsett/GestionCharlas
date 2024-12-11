<template>
  <MenuComponent v-if="isLoggedIn"/>
  <router-view></router-view>
</template>

<script>
import Cookies from 'cookies-js';
import MenuComponent from './components/MenuComponent.vue';

export default {
  name: 'App',
  components: {
    MenuComponent
  },
  data() {
    return {
      isLoggedIn: false,
    };
  },
  watch: {
    // Observamos los cambios en la ruta para verificar login
    '$route'() {
      this.checkAuthentication();
    },
  },
  created() {
    // Llamamos al método para comprobar si el usuario está autenticado
    this.checkAuthentication();  
  },
  methods: {
    checkAuthentication() {
      const token = Cookies.get('bearer_token');
      this.isLoggedIn = !!token; // Determina si el usuario está logueado
    },
  },
}
</script>

<style>

</style>
