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
import { useAuthStore } from '@/stores/auth.js'; 
import RecursiveComponent from '@/components/RecursiveComponent.vue';

export default {
  components: {
    RecursiveComponent
  },
  data() {
    return {
      categories: [],
      lines: [],
      individualAchievements: []
    };
  },
  methods: {
    async fetchAchievements() {
      try {
        const authStore = useAuthStore();
        const cosmicrafts = await authStore.cosmicraftsCanister;
        console.log("Achievements: " + cosmicrafts);
        const [categories, lines, individualAchievements] = await cosmicrafts.getAchievementsView();
        this.categories = categories;
        this.lines = lines;
        this.individualAchievements = individualAchievements;
        console.log(cosmicrafts);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      }
    },
    getChildren(id, type) {
      if (type === 'category') {
        return this.lines.filter(line => line.categoryId === id);
      }
      if (type === 'line') {
        return this.individualAchievements.filter(achievement => achievement.achievementId === id);
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