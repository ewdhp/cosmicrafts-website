import { defineStore } from 'pinia';
import useCanisterStore from '@/stores/canister.js';
import useAuthStore from './auth';
import md5 from 'md5'; // Assuming you have an md5 library installed

export const useProfileStore = defineStore(
  'profileStore', {

  state: () => ({
    loading: true,
    loaded: false,
    userBasicInfo: null,
    userNetwork: null,
    dataHash: '',
  }),

  actions: {

    async loadStore() {
      if (!this.loaded) {
        this.loading = true;
        await this.fetchProfile();
        this.loaded = true;
        this.loading = false;
      } else {
        await this.fetchProfile();
      }
    },

    async fetchProfile() {
      const authStore = useAuthStore();
      const canisterStore = useCanisterStore();
      const cosmicrafts = await canisterStore.get('cosmicrafts');
      const id = authStore.getIdentity().getPrincipal();
      const profile = await Promise.all([
        cosmicrafts.getUserBasicInfoByID(id),
        cosmicrafts.getUserNetwork(id)
      ]);
      const newDataString = JSON.stringify(
        profile, (key, value) =>
        typeof value === 'bigint' ?
          value.toString() : value
      );
      const newHash = md5(newDataString);
      if (newHash !== this.dataHash) {
        [
          this.userBasicInfo,
          this.userNetwork
        ] = profile;
        this.dataHash = md5(newDataString);
      }
      console.log(this.userBasicInfo);
      console.log(this.userNetwork);
    },
  },
});
export default useProfileStore;