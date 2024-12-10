<template>
  <router-view></router-view>
</template>

<script>
// import Cookies from 'cookies-js';

export default {
  name: 'App',
  components: {
    
  },
  created() {
    this.checkAuthentication();  // Llamamos al método para comprobar si el usuario está autenticado
  },
  methods: {
    checkAuthentication() {
      // const token = Cookies.get('bearer_token');
      
      // Si no existe el token, redirigimos a la página de login
      // if (!token) {
      //   this.$router.push('/login');
      // } else {
      //   // Si existe el token, redirigimos al Home
      //   this.$router.push('/');
      // }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
