<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth.js';

const authStore = useAuthStore();

if (!authStore.initialized) {
   console.log("authStore not initialized");
  authStore.initializeStore();
}

const principalId = computed(() => authStore.principalId);

const privacySettings = ref('');

onMounted(async () => {
  try {

    const canister = authStore.cosmicraftsCanister;
    if (canister) {
      console.log("STORE Cosmicrafts canister initialized successfully:", canister);
      const result = await canister.getMyPrivacySettings();
      console.log("STORE Result from getMyPrivacySettings:", result);
      privacySettings.value = result;
    } else {
      console.error("STORE Failed to initialize cosmicrafts canister.");
    }
  
  } catch (error) {
    console.error("Error initializing cosmicrafts canister:", error);
  }
});
</script>

<template>
  <div class="user-info">
    <h2>Welcome to your dashboard</h2>
    <div>
      <strong>Principal ID:</strong>
      <p>{{ principalId }}</p>
      <strong>Privacy settings:</strong>
      <p>{{ privacySettings }}</p>
    </div>
  </div>
</template>

<style scoped>
.user-info {
  margin: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
}

strong {
  display: block;
  margin-bottom: 5px;
}
</style>