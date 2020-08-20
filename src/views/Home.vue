<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    this is base home page
    <hr />
    username:
    <input type="text" v-model="username" />
    password:
    <input type="text" v-model="password" />
    <div></div>
    <button style="padding: 14px;" @click="login">login</button>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import { mapState } from 'vuex';
export default {
  name: 'Home',
  components: {
    HelloWorld,
  },
  data() {
    return {
      username: '',
      password: '',
    };
  },
  computed: {
    ...mapState('userStore', {
      uname: 'username',
      upsd: 'password',
      currentUser: 'currentUser',
    }),
  },
  mounted() {
    this.username = this.currentUser.username;
    this.password = this.currentUser.password;
  },
  methods: {
    login() {
      let params = {
        username: this.username,
        password: this.password,
      };
      this.$store.dispatch('userStore/login', params);
    },
  },
};
</script>
