// src/store/nftStore.js
import { defineStore } from 'pinia';
import { Principal } from '@dfinity/principal';
import { useAuthStore } from './auth';
import { useCanisterStore } from './canister.js';

export const useNFTStore = defineStore('nfts', {
  state: () => ({
    icrc7Tokens: {},
    metadata: {},
    collectionMetadata: {},
    loading : true,
  }),
  actions: {
    async fetchICRC7Tokens() {
      try {
        console.log("fetchICRC7Tokens");
        const authStore = useAuthStore();
        const canisterStore = useCanisterStore();
        const canisterId = canisterStore.canisterId;

        const principalIdString = await authStore.getPrincipalId();
  
        console.log("principalIdString:", principalIdString);
  
        const canister = useCanisterStore();
        const cosmicrafts = await canister.get("cosmicrafts");

        const account = Principal.fromText(principalIdString);
  
        const result = await cosmicrafts.icrc7_tokens_of({ owner: account, subaccount: [] });

        if ('Ok' in result) {
          this.icrc7Tokens[canisterId] = result.Ok;
  
          for (const tokenId of result.Ok) {
            await this.fetchICRC7TokenMetadata(canisterId, tokenId);
          }
        } else {
          throw new Error('Error fetching ICRC7 tokens');
        }
      } catch (error) {
        console.error('Error fetching ICRC7 tokens:', error);
      }
    },

    async fetchICRC7TokenMetadata(tokenId) {
      const canisterStore = useCanisterStore();
        const canisterId = canisterStore.canisterId;
      try {
        const canister = useCanisterStore();
        const cosmicrafts = await canister.get("cosmicrafts");
        const result = await cosmicrafts.icrc7_metadata(tokenId);
        if ('Ok' in result) {
          if (!this.metadata[canisterId]) {
            this.metadata[canisterId] = {};
          }
          this.metadata[canisterId][tokenId.toString()] = result.Ok;
        } else {
          throw new Error('Error fetching ICRC7 token metadata');
        }
      } catch (error) {
        console.error('Error fetching ICRC7 token metadata:', error);
      }
    },

    async fetchICRC7CollectionMetadata() {
      const canisterStore = useCanisterStore();
      const canisterId = canisterStore.canisterId;
      try {
        const canister = useCanisterStore();
        const cosmicrafts = await canister.get("cosmicrafts");
        const collectionMetadata = await cosmicrafts.icrc7_collection_metadata();
        this.collectionMetadata[canisterId] = collectionMetadata;
      } catch (error) {
        console.error('Error fetching ICRC7 collection metadata:', error);
      }
    },

    async transferICRC7Token(to, tokenIds, memo) {
      try {
        const authStore = useAuthStore();
        const principalIdString = await authStore.getPrincipalId();

        const from = Principal.fromText(principalIdString);
        const toAccount = Principal.fromText(to);

        const canister = useCanisterStore();
        const cosmicrafts = await canister.get("cosmicrafts");
      
        const transferArgs = {
          from,
          to: toAccount,
          token_ids: tokenIds,
          memo: memo ? [memo] : [],
        };

        const result = await cosmicrafts.icrc7_transfer(transferArgs);
        if ('Ok' in result) {
          console.log('Transfer successful');
        } else {
          throw new Error('Error transferring ICRC7 token');
        }
      } catch (error) {
        console.error('Error transferring ICRC7 token:', error);
      }
    },
  },
});