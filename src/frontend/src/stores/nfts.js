// src/store/nftStore.js
import { defineStore } from 'pinia';
import { Principal } from '@dfinity/principal';
import { useAuthStore } from './auth';
import { useCanisterStore } from './canister.js';

//create a initialization store function to init all required stores

export const useNFTStore = defineStore('nfts', {
  state: () => ({
    nfts: [],
    collection: {},
    loading: true,
  }),
  actions: {
    async fetchNFTs() {
      try {
        console.log("fetchNFTs");
        const authStore = useAuthStore();
        const canister = useCanisterStore();       
        const cosmicrafts = await canister.get("cosmicrafts");
        const id = await authStore.getPrincipalId().toText();

        /**
        public type TokenId = Nat;       
        public type TokenMetadata = {
          tokenId : TokenId;
          owner : Account;
          metadata : Metadata;
        };
         */
        this.nfts = await cosmicrafts.getNFTs(id);

      } catch (error) {
        console.error('Error fetching NFTs:', error);
      }
    },

    async fetchCollection() {
      try {
        console.log("fetchCollection");
        const canister = useCanisterStore();
        const cosmicrafts = await canister.get("cosmicrafts");
        const canisterId = canister.cosmicraftsId;
        /**
        public type CollectionMetadata = {
          name : Text;
          symbol : Text;
          royalties : ?Nat16;
          royaltyRecipient : ?Account;
          description : ?Text;
          image : ?Blob;
          totalSupply : Nat;
          supplyCap : ?Nat;
        };
         */
        this.collection = await cosmicrafts.icrc7_collection_metadata();

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