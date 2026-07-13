<template>
  <section id="profile" class="py-16 md:py-20">
    <div class="section-shell">
      <div class="reveal max-w-2xl">
        <div class="flex items-center gap-3">
          <span class="section-index">00</span>
          <h2 class="section-kicker">About</h2>
        </div>
        <div class="mt-5 grid gap-1.5">
          <p
            v-for="paragraph in aboutParagraphs"
            :key="paragraph"
            class="text-secondary text-lg leading-8"
          >
            {{ paragraph.trim() }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { profile } from "@/data/portfolio";

const aboutParagraphs = profile.summary.match(/[^.]+\./g) ?? [profile.summary];
</script>
