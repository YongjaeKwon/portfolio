<template>
  <nav
    class="fixed top-0 w-full bg-black p-4 flex justify-between items-center z-50"
  >
    <h1 class="text-2xl font-extrabold text-white tracking-widest">
      MY PORTFOLIO
    </h1>
    <div>
      <a
        class="mx-4 text-gray-400 hover:text-green-400 transition cursor-pointer"
        @click="$emit('scroll-to-section', 'home')"
        >Home</a
      >
      <a
        class="mx-4 text-gray-400 hover:text-green-400 transition cursor-pointer"
        @click="$emit('scroll-to-section', 'projects')"
        >Projects</a
      >
      <a
        class="mx-4 text-gray-400 hover:text-green-400 transition cursor-pointer"
        @click="$emit('scroll-to-section', 'experience')"
        >Experience</a
      >
    </div>
  </nav>
</template>
