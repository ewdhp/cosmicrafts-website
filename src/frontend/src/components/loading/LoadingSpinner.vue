<template>
  <div v-if="isLoading" class="loading-overlay">
    <div class="spinner"></div>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    isLoading: {
      type: Boolean,
      required: true
    }
  }
};
</script>

<style scoped>
.loading-overlay {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 9999; /* Ensure it is above other content */
}

.spinner {
  border: 8px solid rgba(223, 230, 235, 0.904);
  border-top: 8px solid #151927;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>