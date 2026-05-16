<template>
  <div class="login-page">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="username">Username:</label>
        <input
          type="text"
          id="username"
          v-model="username"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          v-model="password"
          required
        />
      </div>

      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    handleLogin() {
      // For now, just log the values
      console.log("Username:", this.username);
      console.log("Password:", this.password);

      // Later you can add authentication logic here
      alert(`Logged in as ${this.username}`);
    },
  },
};
</script>

<style scoped>
.login-page {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff8dc; /* light bakery-style background */
  border: 1px solid #ccc;
  border-radius: 8px;
}

h2 {
  text-align: center;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.3rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #aaa;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 0.7rem;
  background: #8b4513;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #a0522d;
}
</style>
