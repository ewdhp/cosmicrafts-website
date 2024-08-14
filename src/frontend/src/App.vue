<script setup>
import { ref } from "vue";
import { cosmicrafts } from "declarations/cosmicrafts/index";
import MainLayout from '@/layouts/MainLayout.vue';

let greeting = ref("");

async function handleSubmit(e) {
  e.preventDefault();
  const target = e.target;
  const name = target.querySelector("#name").value;
  await cosmicrafts.greet(name).then((response) => {
    greeting.value = response;
  });
}
</script>

<template>
  <main>
    <MainLayout />
  </main>
</template>
