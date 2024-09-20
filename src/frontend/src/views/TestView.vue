<template>
  <div>
      <p>
          Ejemplos practicos de como obtener la informacion desde stable store
      </p>
  </div>
</template>
<script>
import { ref, onMounted, computed } from 'vue';
import { Cosmicrafts } from '@/stores/cosmicrafts';
import LoadingSpinner from '@/components/loading/LoadingSpinner.vue';

export default {
  name: 'TestView',
  components: {
  LoadingSpinner
},
setup() {

  onMounted(
    async () => {
      const actor = Cosmicrafts()
      actor.load()
  });
  
  return {
    player: {},
    settings: {}, 
    referral: {},
    achiev: {},
    stat: {},
    token: {},
    tourney: {},
    mission: {}, 
    top: {},
  };
}
};
// misssion.gral y missin.user
</script>

<style scoped>
.test-view {
  padding: 20px;
}

.test-view h1 {
  color: #333;
}

.test-view p {
  font-size: 16px;
}
</style>