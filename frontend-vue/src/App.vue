<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-brand">
          <h2>🏢 Golden TEX</h2>
          <span class="nav-subtitle">Uzum Market Dashboard</span>
        </div>
        <div class="nav-links">
          <router-link to="/stocks" class="nav-link">
            📦 Stocks
          </router-link>
          <router-link to="/order" class="nav-link">
            🔍 Orders
          </router-link>
        </div>
      </div>
    </nav>
    
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
}

.navbar {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand h2 {
  font-size: 1.5rem;
  color: #1f2937;
  margin-bottom: 4px;
}

.nav-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
}

.nav-links {
  display: flex;
  gap: 16px;
}

.nav-link {
  padding: 10px 20px;
  text-decoration: none;
  color: #6b7280;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.nav-link:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.nav-link.router-link-active {
  background: #7F4EFF;
  color: white;
  border-color: transparent;
}
</style>
