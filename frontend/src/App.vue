<template>
  <div class="app">
    <!-- Navigation bar -->
    <nav class="navbar">
      <div class="brand">Bakery Production System</div>
      <div class="nav-links">
        <router-link to="/dashboard">Dashboard</router-link>
        <router-link to="/products">Products</router-link>
        <router-link to="/sales">Sales</router-link>
        <router-link to="/login">Login</router-link>
      </div>
    </nav>

    <!-- Dynamic page content -->
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style scoped>
.app {
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #8b4513; /* chocolate brown */
  color: white;
  padding: 1rem;
}

.brand {
  font-size: 1.2rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
}

.nav-links a:hover {
  text-decoration: underline;
}

.content {
  flex: 1;
  padding: 2rem;
  background: #fdf5e6; /* light bakery-style background */
}
</style>
