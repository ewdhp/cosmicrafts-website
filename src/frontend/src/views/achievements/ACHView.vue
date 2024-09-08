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
import { useCanisterStore } from '@/stores/canister.js'; 
import RecursiveComponent from '@/components/RecursiveComponent.vue';

export default {
  components: {
    RecursiveComponent
  },
  data() {
    return {
      categories: [],
      lines: [],
      individual: []
    };
  },
  methods: {
    async fetchAchievements() {
      try {
        const canister = useCanisterStore();
        const cosmicrafts = await canister.get("comiscrafts");
        const [categories, lines, individual] = await cosmicrafts.getAchievementsView();
        this.categories = categories;
        this.lines = lines;
        this.individual = individual;
        console.log("lines:", lines);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      }
    },
    getChildren(id, type) {
      if (type === 'category') {
        return this.lines.filter(line => line.categoryId === id);
      }
      if (type === 'line') {
        return this.individual.filter(achievement => achievement.achievementId === id);
      }
      return [];
    }
  },
  async mounted() {
    await this.fetchAchievements();
  }
};
</script>

<style scoped>
/* Add your styles here */
</style>