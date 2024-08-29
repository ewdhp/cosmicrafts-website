import { defineStore } from 'pinia';
import { Actor, HttpAgent } from '@dfinity/agent';
import { cosmicrafts } from '@/declarations/cosmicrafts';
import { useAuthStore } from '@/stores/authStore';

export const useCosmicraftsStore = defineStore('cosmicrafts', () => {
  let canisterId = null; // Private variable

  const state = () => ({
    playerData: null,
    agent: null,
    actor: null,
  });

  const actions = {
    initialize() {
      const authStore = useAuthStore();
      const principalId = authStore.principalId;

      this.agent = new HttpAgent();
      this.actor = Actor.createActor(cosmicrafts, { agent: this.agent, canisterId: principalId });
      canisterId = principalId;
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