import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useCanisterStore } from './canister.js';

export const Cosmicrafts = defineStore('Cosmicrafts', {
  state: () => ({
    loadded: false,
    loading: true,
    player: false,
    settings: false,
    referrals: false,
    achs: false,
    stats: false,
    tokens: false,
    tourneys: false,
    missions: false,
    tops: false,
    cosmicrafts: null,
  }),
  actions: {
    async init() {
      if (!this.canister) {
        const canister = useCanisterStore();
        this.cosmicrafts = await canister.get("cosmicrafts");
      }
    },
    async load() {
      try {
        if (!this.loadded) {
          this.loading = true;
          await this.init();
          this.player = await this.cosmicrafts.get_player();
          this.settings = await this.cosmicrafts.get_settings();
          this.referrals = await this.cosmicrafts.get_referrals();
          this.achs = await this.cosmicrafts.get_achs();
          this.stats = await this.cosmicrafts.get_stats();
          this.tokens = await this.cosmicrafts.get_tokens();
          this.tourneys = await this.cosmicrafts.get_tourneys();
          this.missions = await this.cosmicrafts.get_missions();
          this.tops = await this.cosmicrafts.get_tops();
          this.loadded = true;
          this.loading = false;
          console.log("Player: ", this.player);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async get_player() {
      await this.init();
      this.player = await this.cosmicrafts.get_player();
    },
    async get_settings() {
      await this.init();
      this.settings = await this.cosmicrafts.get_settings();
    },
    async get_referrals() {
      await this.init();
      this.referrals = await this.cosmicrafts.get_referrals();
    },
    async get_tourneys() {
      await this.init();
      this.tourneys = await this.cosmicrafts.get_tourneys();
    },
    async get_missions() {
      await this.init();
      this.missions = await this.cosmicrafts.get_missions();
    },
    async get_stats() {
      await this.init();
      this.stats = await this.cosmicrafts.get_stats();
    },
    async get_tokens() {
      await this.init();
      this.tokens = await this.cosmicrafts.get_tokens();
    },
    async get_tops() {
      await this.init();
      this.tops = await this.canister.get_tops();
    },
    async get_achs() {
      await this.init();
      this.achs = await this.canister.get_achs();
    },
  }
});