<template>
  <h2>Achievements</h2>
    <div v-if="!loading">
      <RecursiveComponent
      v-for="category in categories"
      :key="category.id"
      :item="category"
      type="category"
      :getChildren="getChildren"
    />
    </div>
    <div v-else>
      <LoadingSpinner :isLoading=loading />
    </div>
</template>

<script>
import { useCanisterStore } from '@/stores/canister.js'; 
import RecursiveComponent from '@/components/RecursiveComponent.vue';
import LoadingSpinner from '@/components/loading/LoadingSpinner.vue';
export default {
  components: {
    RecursiveComponent,
    LoadingSpinner
  },
  data() {
    return {
      loading: true,
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
      } finally {
        this.loading = false;
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
h2 {
  color: #2c3e50;
  padding: 0px;
  margin: 0px;
  margin-bottom: 1em;
}
</style>