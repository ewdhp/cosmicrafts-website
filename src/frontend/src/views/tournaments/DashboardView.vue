<template>
  <h2>Tournaments</h2>
  <div>

        <form @submit.prevent="createTournament">
          <input v-model="name" type="text" placeholder="Tournament Name" />
          <input v-model="startDate" type="date" r />
          <input v-model="prizePool" type="number" placeholder="Prize Pool"  />
          <input v-model="expirationDate" type="date" />
          <input type="submit">
        </form>
    
      <div>

        <ul>
          <li v-for="tournament in tournaments" :key="tournament.id">
            {{ tournament.name }} - {{ new Date(tournament.startDate).toLocaleDateString() }}
          </li>
        </ul>
      </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useTournamentStore } from '@/stores/tournament.js';

const tournamentStore = useTournamentStore();

const showCreateTournamentForm = ref(false);
const name = ref('');
const startDate = ref('');
const prizePool = ref('');
const expirationDate = ref('');
const isLoading = ref(true); // Loading state
const tournaments = ref([]); // Tournaments list

const fetchAllTournaments = async () => {
  try {
    await tournamentStore.fetchAllTournaments();
    tournaments.value = tournamentStore.tournaments;
  } catch (error) {
    console.error('Failed to fetch tournaments:', error);
  }
};

const createTournament = async () => {
  try {
    isLoading.value = true; // Set loading state to true
    await tournamentStore.createTournament(
      name.value,
      new Date(startDate.value).getTime(),
      prizePool.value.toString(),
      new Date(expirationDate.value).getTime()
    );
    await fetchAllTournaments();
    // Reset form fields
    name.value = '';
    startDate.value = '';
    prizePool.value = '';
    expirationDate.value = '';
    showCreateTournamentForm.value = false;
  } catch (error) {
    console.error('Failed to create tournament:', error);
  } finally {
    isLoading.value = false; // Set loading state to false
  }
};

onMounted(async () => {
  try {
    await fetchAllTournaments();
  } catch (error) {
    console.error('Failed to fetch tournaments:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>