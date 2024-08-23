import { defineStore } from 'pinia';
import { fetchUserDetails } from '@/services/UserService';

export const usePlayerStore = defineStore('player', {
  state: () => ({
    userDetails: null,
  }),
  actions: {
    async fetchUserDetails(canisterId, account) {
      this.userDetails = await fetchUserDetails(canisterId, account);
    },
  },
});
