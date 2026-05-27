<template>
  <footer id="contact" class="border-t border-[var(--border)] px-6 py-12">
    <div class="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
      <div>
        <p class="text-primary text-2xl font-black">{{ profile.name }}</p>
        <p class="text-muted mt-2 text-sm">
          {{ profile.role }} · {{ profile.location }}
        </p>
      </div>

      <div class="flex flex-wrap gap-3">
        <a
          class="focus-ring nav-panel text-primary inline-flex items-center gap-2 rounded-md px-4 py-3 text-sm font-bold transition hover:text-[var(--accent-strong)]"
          :href="profile.github"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
          <ExternalLink class="h-4 w-4" />
        </a>
        <a
          class="focus-ring accent-bg inline-flex items-center gap-2 rounded-md px-4 py-3 text-sm font-black transition hover:brightness-105"
          :href="`mailto:${profile.email}`"
        >
          {{ profile.email }}
          <Mail class="h-4 w-4" />
        </a>
        <a
          class="focus-ring nav-panel text-primary inline-flex items-center gap-2 rounded-md px-4 py-3 text-sm font-bold transition hover:text-[var(--accent-strong)]"
          :href="`tel:${profile.phone.replace(/-/g, '')}`"
        >
          {{ profile.phone }}
          <Phone class="h-4 w-4" />
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ExternalLink, Mail, Phone } from "@lucide/vue";
import { profile } from "@/data/portfolio";
</script>
