<template>
  <div>
    <RecursiveComponent
      v-for="category in categories"
      :key="category.id"
      :item="category"
      type="category"
      :getChildren="getChildren"
    />
  </div>
</template>

<script>
import { useACHStore } from '@/stores/ach.js'; 
import RecursiveComponent from '@/components/RecursiveComponent.vue';
import { computed } from 'vue';

export default {
  components: {
    RecursiveComponent
  },
  setup() {
    const ach = useACHStore();

    const categories = computed(() => ach.categories);
    const lines = computed(() => ach.lines);
    const individual = computed(() => ach.individual);

    return {
      categories,
      lines,
      individual,
      fetchAchievements: async () => {
        await ach.fetchAchievements();
      },
      getChildren: (id, type) => {
        if (type === 'category') {
          return lines.value.filter(line => line.categoryId === id);
        }
        if (type === 'line') {
          return individual.value.filter(achievement => achievement.achievementId === id);
        }
        return [];
      }
    };
  },
  async mounted() {
    await this.fetchAchievements();
  }
};
</script>

<style scoped>
/* Add your styles here */
</style>