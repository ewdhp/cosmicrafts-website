import { defineStore } from 'pinia';
import { Actor, HttpAgent } from '@dfinity/agent';
import { cosmicrafts } from '@/declarations/cosmicrafts';
import { useAuthStore } from '@/stores/authStore';

export const useCosmicraftsStore = defineStore('cosmicrafts', () => {

  const canisterId = network === 'ic' 
    ? import.meta.env.VITE_CANISTER_ID_IC 
    : import.meta.env.VITE_CANISTER_ID_LOCAL;

  const state = () => ({
    playerData: null,
    agent: null,
    actor: null,
  });

  const actions = {
    initialize() {
      const authStore = useAuthStore();
      const principalId = authStore.principalId;

      this.agent = new HttpAgent({ host: network === 'ic' ? 'https://ic0.app' : 'http://localhost:8000' });
      this.actor = Actor.createActor(cosmicrafts, { agent: this.agent, canisterId });
    },
    async fetchPlayerData(account) {
      if (!this.actor) {
        throw new Error('Actor not initialized. Call initialize() first.');
      }
      this.playerData = await this.actor.fetchPlayerData(account);
    },
  };

  return { state, actions };
});