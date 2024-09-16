<template>
  <h2>Stats</h2>
  <div class="statistics">
    <div v-if="playerStats && Object.keys(playerStats).length">

      <h3>Average Stats</h3>
      <div class="stat-block">
        <p>Average Damage Dealt: {{ formatNumber(averageStats.averageDamageDealt) }}</p>
        <p>Average Energy Generated: {{ formatNumber(averageStats.averageEnergyGenerated) }}</p>
        <p>Average Energy Used: {{ formatNumber(averageStats.averageEnergyUsed) }}</p>
        <p>Average Kills: {{ formatNumber(averageStats.averageKills) }}</p>
        <p>Average XP Earned: {{ formatNumber(averageStats.averageXpEarned) }}</p>
      </div>

      <h3>My Stats</h3>
      <div class="stat-block">
        <p>Games Lost: {{ formatNumber(myStats.gamesLost) }}</p>
        <p>Energy Generated: {{ formatNumber(myStats.energyGenerated) }}</p>
        <p>Games Played: {{ formatNumber(myStats.gamesPlayed) }}</p>
        <p>Total Damage Dealt: {{ formatNumber(myStats.totalDamageDealt) }}</p>
        <p>Total Damage Crit: {{ formatNumber(myStats.totalDamageCrit) }}</p>
        <p>Total Damage Taken: {{ formatNumber(myStats.totalDamageTaken) }}</p>
        <p>Energy Used: {{ formatNumber(myStats.energyUsed) }}</p>
        <p>Total Damage Evaded: {{ formatNumber(myStats.totalDamageEvaded) }}</p>
        <p>Energy Wasted: {{ formatNumber(myStats.energyWasted) }}</p>
        <p>Games Won: {{ formatNumber(myStats.gamesWon) }}</p>
        <p>Total XP Earned: {{ formatNumber(myStats.totalXpEarned) }}</p>
      </div>

      <h3>My Average Stats</h3>
      <div class="stat-block">
        <p>Average Damage Dealt: {{ formatNumber(myAverageStats.averageDamageDealt) }}</p>
        <p>Average Energy Generated: {{ formatNumber(myAverageStats.averageEnergyGenerated) }}</p>
        <p>Average Energy Used: {{ formatNumber(myAverageStats.averageEnergyUsed) }}</p>
        <p>Average Kills: {{ formatNumber(myAverageStats.averageKills) }}</p>
        <p>Average XP Earned: {{ formatNumber(myAverageStats.averageXpEarned) }}</p>
      </div>

      <h3>Game Mode Stats</h3>
      <div class="stat-block" v-for="gameMode in playerStats.totalGamesGameMode" :key="gameMode.gameModeID">
        <p>Game Mode ID: {{ gameMode.gameModeID }}</p>
        <p>Games Played: {{ formatNumber(gameMode.gamesPlayed) }}</p>
        <p>Games Won: {{ formatNumber(gameMode.gamesWon) }}</p>
      </div>

      <h3>Faction Stats</h3>
      <div class="stat-block" v-for="faction in playerStats.totalGamesWithFaction" :key="faction.factionID">
        <p>Faction ID: {{ faction.factionID }}</p>
        <p>Games Played: {{ formatNumber(faction.gamesPlayed) }}</p>
        <p>Games Won: {{ formatNumber(faction.gamesWon) }}</p>
      </div>

      <h3>Character Stats</h3>
      <div class="stat-block" v-for="character in playerStats.totalGamesWithCharacter" :key="character.characterID">
        <p>Character ID: {{ character.characterID }}</p>
        <p>Games Played: {{ formatNumber(character.gamesPlayed) }}</p>
        <p>Games Won: {{ formatNumber(character.gamesWon) }}</p>
      </div>
    </div>
    <div v-else>
      <p>Loading statistics...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useStatisticsStore } from '@/stores/stats.js';

const statisticsStore = useStatisticsStore();

onMounted(async () => {
  //await statisticsStore.fetchPlayerStats();
});

const playerStats = computed(() => statisticsStore.playerStats);
const averageStats = computed(() => statisticsStore.averageStats);
const myAverageStats = computed(() => statisticsStore.myAverageStats);
const myStats = computed(() => statisticsStore.myStats);

const formatNumber = (number) => {
  if (typeof number === 'bigint') {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return number.toLocaleString();
};
</script>

<style scoped>
.statistics {
  font-family: Arial, sans-serif;
  padding: 20px;
}

h2 {
  color: #2c3e50;
  padding: 0px;
  margin: 0px;
  margin-bottom: 1em;
}
.stat-block {
  background-color: #ecf0f1;
  border: 1px solid #bdc3c7;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 20px;
}

.stat-block p {
  margin: 5px 0;
}
</style>
