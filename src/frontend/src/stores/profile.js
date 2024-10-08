import { defineStore } from 'pinia';
import useCanisterStore from '@/stores/canister.js';
import useAuthStore from './auth';
import md5 from 'md5'; // Assuming you have an md5 library installed
import { Principal } from '@dfinity/principal';
const principalToString = (principal) => {
  return Principal.from(principal).toText();
};

const convertBP = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(convertBP);
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(
        ([k, v]) => [
          k, typeof v === 'bigint' ? v.toString() :
            (
              v && v._isPrincipal ? principalToString(v) :
                convertBP(v)
            )
        ]
      )
    );
  }
  return obj;
};

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
        this.loadState();
        await this.fetchProfile();
        this.loaded = true;
        this.loading = false;
      } else {
        this.loadState();
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
        ] = convertBP(profile);
        this.dataHash = md5(newDataString);
        this.saveState();
      }
      console.log(this.userBasicInfo);
      console.log(this.userNetwork);
    },
    saveState() {
      const stateString = JSON.stringify(
        this.$state, (key, value) => (
          typeof value === 'bigint' ?
            value.toString() : value
        ));
      localStorage.setItem(
        'profileState',
        stateString
      );
    },

    loadState() {
      const stateString =
        localStorage.getItem('profileState');
      if (stateString) {
        const state = JSON.parse(stateString,
          (key, value) => (
            typeof value === 'string' &&
              /^\d+n$/.test(value) ?
              convertBP(value.slice(0, -1)) : value
          ));
        console.log(
          "Loaded state from localStorage:",
          state
        );
        this.$state = state;

      }
    },

  },
});
export default useProfileStore;