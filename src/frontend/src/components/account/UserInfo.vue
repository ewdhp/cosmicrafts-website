<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth.js';
import { getCanister } from '../../services/CanisterFactoryService.js';

const authStore = useAuthStore();
const principalId = computed(() => authStore.principalId);

let cosmicraftsCanister = null;
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
    cosmicraftsCanister = await getCanister("cosmicrafts");
    if (cosmicraftsCanister) {
      console.log("Cosmicrafts canister initialized successfully:", cosmicraftsCanister);
      // Call the desired method on the canister
      const result = await cosmicraftsCanister.getMyPrivacySettings();
      console.log("Result from getMyPrivacySettings:", result);
      privacySettings.value = result;
    } else {
      console.error("Failed to initialize cosmicrafts canister.");
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