<template>
  <header
    class="fixed top-0 w-full bg-black bg-opacity-90 text-white py-4 px-6 z-50"
  >
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-xl font-bold">Yongjae's Portfolio</h1>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex space-x-6">
        <div>
          <a
            class="mx-4 text-gray-400 hover:text-green-400 transition cursor-pointer"
            @click="moveToSection('hero')"
            >Home</a
          >
          <a
            class="mx-4 text-gray-400 hover:text-green-400 transition cursor-pointer"
            @click="moveToSection('profile')"
            >Profile</a
          >
          <a
            class="mx-4 text-gray-400 hover:text-green-400 transition cursor-pointer"
            @click="moveToSection('projects')"
            >Projects</a
          >
          <a
            class="mx-4 text-gray-400 hover:text-green-400 transition cursor-pointer"
            @click="moveToSection('experience')"
            >Experience</a
          >
        </div>
      </nav>

      <!-- Mobile Navigation -->
      <div class="md:hidden relative">
        <button @click="toggleMenu" class="focus:outline-none">
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>

        <!-- Dropdown Menu with Blur Effect -->
        <div
          class="absolute top-10 right-0 w-48 backdrop-blur-sm text-white rounded-lg shadow-lg transform transition-all duration-300 origin-top-right scale-y-0 opacity-0"
          :class="{ 'scale-y-100 opacity-100': isMenuOpen }"
        >
          <nav class="flex flex-col space-y-4 py-4 px-6">
            <a class="hover:text-green-400" @click="mobileMoveToSection('hero')"
              >Home</a
            >
            <a
              class="hover:text-green-400"
              @click="mobileMoveToSection('profile')"
              >Profile</a
            >
            <a
              class="hover:text-green-400"
              @click="mobileMoveToSection('projects')"
              >Projects</a
            >
            <a
              class="hover:text-green-400"
              @click="mobileMoveToSection('experience')"
              >Experience</a
            >
          </nav>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits(["scroll-to-section"]);
const isMenuOpen = ref<boolean>(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const moveToSection = (section: string) => {
  emit("scroll-to-section", section);
};

const mobileMoveToSection = (section: string) => {
  isMenuOpen.value = false;
  emit("scroll-to-section", section);
};
</script>
<style></style>
