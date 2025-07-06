<template>
  <div>
    <h2>Login / Register Vue</h2>
    <input v-model="username" placeholder="Username" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="register">Register</button>
    <button @click="login">Login</button>
    <p>{{ message }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      message: ''
    };
  },
  methods: {
    async register() {
      try {
        const res = await axios.post('http://localhost:3001/api/register', {
          username: this.username,
          password: this.password
        });
        this.message = res.data.message;
      } catch (e) {
        this.message = e.response?.data?.error || 'Erreur';
      }
    },
    async login() {
      try {
        const res = await axios.post('http://localhost:3001/api/login', {
          username: this.username,
          password: this.password
        });
        this.message = res.data.message;
      } catch (e) {
        this.message = e.response?.data?.error || 'Erreur';
      }
    }
  }
};
</script>
