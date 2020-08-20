<template>
  <div>
    <div id="nav">
      <router-link to="/">base</router-link>
      <router-link to="/About">About</router-link>
      <router-link to="/microFapp">fdevapp</router-link>
      <router-link to="/microFrqr">fdevrqr</router-link>
    </div>
    <div id="fdevapp"></div>
    <div id="fdevrqr"></div>
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  padding: 20px;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
