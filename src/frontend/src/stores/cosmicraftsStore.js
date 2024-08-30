import { defineStore } from 'pinia';
import { Actor, HttpAgent } from '@dfinity/agent';
import { cosmicrafts } from '../../../declarations/cosmicrafts/index'
import { useAuthStore } from './auth';

export const useCosmicraftsStore = defineStore('cosmicrafts', () => {
  
  
  const state = () => ({
    playerData: null,
    agent: null,
    actor: null,
  });

  const actions = {
 
    async getReferralCode(principalId) {
  
      this.playerData = await cosmicrafts.getReferralCode(principalId);
    },
  };

  return { state, actions };
});