<template>
  <header class="site-header">
    <div class="header-container">
      <div class="header-left">
        <button
          class="nav-toggle"
          @click="drawerOpen = !drawerOpen"
          :aria-label="drawerOpen ? 'Close menu' : 'Open menu'"
          v-if="isMobile"
        >
          <span class="hamburger" :class="{ active: drawerOpen }">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
        <a href="/" class="avatar-link" aria-label="Go to homepage">
          <img src="/moriel-320px.jpg" alt="Moriel Schottlender" class="avatar-image" />
        </a>
        <a href="/" class="site-title">Moriel Writes Tech</a>
      </div>

      <nav class="header-nav" :class="{ open: drawerOpen || !isMobile }">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/posts">Posts</a></li>
          <li><a href="/tags">Tags</a></li>
          <li><a href="https://moriel.tech">About</a></li>
          <li><a href="https://moriel.tech/contact">Contact</a></li>
          
        </ul>
      </nav>

      <div class="header-right">
        <button
          class="theme-toggle"
          @click="toggleTheme"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <svg v-if="isDark" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
      </div>
    </div>

    <nav v-if="drawerOpen && isMobile" class="mobile-drawer" @click="drawerOpen = false">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/posts">Posts</a></li>
        <li><a href="/tags">Tags</a></li>
        <li><a href="https://moriel.tech">About</a></li>
        <li><a href="https://moriel.tech/contact">Contact</a></li>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const drawerOpen = ref(false)
const isDark = ref(true)
const isMobile = ref(false)

onMounted(() => {
  const updateMobileState = () => {
    isMobile.value = window.innerWidth < 768
  }

  updateMobileState()
  window.addEventListener('resize', updateMobileState)

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const stored = localStorage.getItem('theme-dark')
  isDark.value = stored !== null ? stored === 'true' : prefersDark
  applyTheme()
})

function toggleTheme() {
  isDark.value = !isDark.value
  localStorage.setItem('theme-dark', isDark.value.toString())
  applyTheme()
}

function applyTheme() {
  document.documentElement.classList.toggle('light-theme', !isDark.value)
}
</script>

<style scoped>
.site-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(18, 18, 18, 0.8);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.nav-toggle {
  display: none;
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: inherit;
}

.hamburger {
  display: block;
  width: 24px;
  height: 20px;
  position: relative;
}

.hamburger span {
  display: block;
  width: 100%;
  height: 2px;
  background: currentColor;
  position: absolute;
  transition: all 0.3s ease;
}

.hamburger span:nth-child(1) {
  top: 0;
}

.hamburger span:nth-child(2) {
  top: 9px;
}

.hamburger span:nth-child(3) {
  top: 18px;
}

.hamburger.active span:nth-child(1) {
  transform: translateY(9px) rotate(45deg);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: translateY(-9px) rotate(-45deg);
}

.site-title {
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  color: inherit;
}

.header-nav {
  display: flex;
  gap: 2rem;
}

.header-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 2rem;
}

.header-nav a {
  text-decoration: none;
  color: inherit;
  transition: color 0.2s;
}

.header-nav a:hover {
  color: #90caf9;
}

.header-right {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-left: 1em;
}

.avatar-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  overflow: hidden;
}

.avatar-image {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  object-fit: cover;
  border: 1px solid var(--outline);
}

.theme-toggle {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.theme-toggle:hover {
  color: #90caf9;
}

.mobile-drawer {
  display: none;
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-drawer ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mobile-drawer a {
  text-decoration: none;
  color: inherit;
}

@media (max-width: 767px) {
  .nav-toggle {
    display: block;
  }

  .header-nav {
    display: none;
  }

  .mobile-drawer {
    display: block;
  }
}
</style>
