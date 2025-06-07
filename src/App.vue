<template>
  <div>
    <nav>
      <router-link to="/">Inicio</router-link> |
      <router-link to="/especialistas">Especialistas</router-link> |
      <router-link to="/inactivos">Inactivos</router-link>
    </nav>
    <router-view />
  </div>
</template>

<style scoped>
nav {
  background: #f4f4f4;
  padding: 1rem;
}
nav a {
  margin-right: 1rem;
  font-weight: bold;
  color: #333;
}
</style>
