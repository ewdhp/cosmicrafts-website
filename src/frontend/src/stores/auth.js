


//fix google login and restructure the code removing no needed functions
//like getting a canister from here...



import { defineStore } from 'pinia';
import { Actor, HttpAgent } from '@dfinity/agent';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import nacl from 'tweetnacl';
import { encode as base64Encode, decode as base64Decode } from 'base64-arraybuffer';
import MetaMaskService from '../services/MetaMaskService';
import PhantomService from '../services/PhantomService';
import { AuthClient } from '@dfinity/auth-client';
//import { cosmicrafts } from '../../../declarations/cosmicrafts/index';
import { createActor } from '../../../declarations/cosmicrafts/index.js';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    googleSub: '',
    principalId: '',
    cosmicrafts: null,
    authClient: null,
    cosmicraftsCanister: null,
  }),
  actions: {
    async initializeStore() {
      const storedData = localStorage.getItem('authStore');
      if (storedData) {
        const data = JSON.parse(storedData);
        this.user = data.user;
        this.isAuthenticated = data.isAuthenticated;
        this.googleSub = data.googleSub;
        this.principalId = data.principalId;

        if (data.authClient) {
          this.authClient = await AuthClient.create();
        }

        if (this.isAuthenticated && this.user) {
          const identity = Ed25519KeyIdentity.fromKeyPair(
            base64ToUint8Array(this.user.publicKey),
            base64ToUint8Array(this.user.privateKey)
          );
          const agent = new HttpAgent({ identity, host: 'https://ic0.app' });

          if (process.env.DFX_NETWORK !== "ic") {
            agent.fetchRootKey().catch((err) => {
              console.warn(
                "Unable to fetch root key. Check to ensure that your local replica is running"
              );
              console.error(err);
            });
          }
          console.log('cosmicraftsCanister', this.cosmicraftsCanister);
          // Initialize the cosmicrafts canister
          this.cosmicraftsCanister = createActor(
            process.env.COSMICRAFTS_CANISTER_ID,
            {
              agent,
            });


        }
      }
    },
    async loginWithGoogle(response, router) {
      const decodedIdToken = response.credential.split('.')[1];
      const payload = JSON.parse(atob(decodedIdToken));
      this.googleSub = payload.sub;
      await this.generateKeysFromSub(this.googleSub, router);
    },
    async loginWithMetaMask(router) {
      const uniqueMessage = 'Sign this message to log in with your Ethereum wallet';
      const signature = await MetaMaskService.signMessage(uniqueMessage);
      if (signature) {
        await this.generateKeysFromSignature(signature, router);
      }
    },
    async loginWithPhantom(router) {
      const message = 'Sign this message to log in with your Phantom Wallet';
      const signature = await PhantomService.signAndSend(message);
      if (signature) {
        await this.generateKeysFromSignature(signature, router);
      }
    },
    async loginWithInternetIdentity(router) {
      await this.loginWithAuthClient('https://identity.ic0.app', router);
    },
    async loginWithNFID(router) {
      await this.loginWithAuthClient('https://nfid.one/authenticate/?applicationName=COSMICRAFTS&applicationLogo=https://cosmicrafts.com/wp-content/uploads/2023/09/cosmisrafts-242x300.png#authorize', router);
    },
    async loginWithAuthClient(identityProviderUrl, router) {
      const authClient = await AuthClient.create();
      this.authClient = authClient;
      await authClient.login({
        identityProvider: identityProviderUrl,
        windowOpenerFeatures: `left=${window.screen.width / 2 - 525 / 2}, top=${window.screen.height / 2 - 705 / 2}, toolbar=0, location=0, menubar=0, width=525, height=705`,
        onSuccess: async () => {
          const identity = authClient.getIdentity();
          await this.createIdentityFromAuthClient(identity, router);
          this.isAuthenticated = true;
          this.saveStateToLocalStorage();
          router.push({ path: '/dashboard' });
        },
        onError: (error) => {
          console.error('Authentication error:', error);
        },
      });
    },
    async createIdentityFromAuthClient(identity, router) {
      const agent = new HttpAgent({ identity, host: 'https://ic0.app' });

      if (process.env.DFX_NETWORK !== "ic") {
        agent.fetchRootKey().catch((err) => {
          console.warn(
            "Unable to fetch root key. Check to ensure that your local replica is running"
          );
          console.error(err);
        });
      }

      const canisterIds = {
        cosmicrafts: process.env.CANISTER_ID_COSMICRAFTS,
      };

      this.principalId = identity.getPrincipal().toText();
      this.user = { publicKey: '', privateKey: '' };
      this.saveStateToLocalStorage();
      router.push({ path: '/dashboard' });
    },
    async generateKeysFromSignature(signature, router) {
      const encoder = new TextEncoder();
      const encodedSignature = encoder.encode(signature);
      const hashBuffer = await crypto.subtle.digest('SHA-256', encodedSignature);
      const seed = new Uint8Array(hashBuffer.slice(0, 32));
      const keyPair = nacl.sign.keyPair.fromSeed(seed);
      const publicKeyBase64 = base64Encode(keyPair.publicKey);
      const privateKeyBase64 = base64Encode(keyPair.secretKey);
      await this.createIdentity(publicKeyBase64, privateKeyBase64, router);
      this.isAuthenticated = true;
      this.saveStateToLocalStorage();
      router.push({ path: '/dashboard' });
    },
    async generateKeysFromSub(sub, router) {
      const encoder = new TextEncoder();
      const encodedSub = encoder.encode(sub);
      const hashBuffer = await crypto.subtle.digest('SHA-256', encodedSub);
      const seed = new Uint8Array(hashBuffer.slice(0, 32));
      const keyPair = nacl.sign.keyPair.fromSeed(seed);
      const publicKeyBase64 = base64Encode(keyPair.publicKey);
      const privateKeyBase64 = base64Encode(keyPair.secretKey);
      await this.createIdentity(publicKeyBase64, privateKeyBase64, router);
      this.isAuthenticated = true;
      this.saveStateToLocalStorage();
      router.push({ path: '/dashboard' });
    },
    async createIdentity(publicKey, privateKey, router) {
      const identity = Ed25519KeyIdentity.fromKeyPair(
        base64ToUint8Array(publicKey),
        base64ToUint8Array(privateKey)
      );
      const agent = new HttpAgent({ identity, host: 'https://ic0.app' });

      if (process.env.DFX_NETWORK !== "ic") {
        agent.fetchRootKey().catch((err) => {
          console.warn(
            "Unable to fetch root key. Check to ensure that your local replica is running"
          );
          console.error(err);
        });
      }

      const canisterIds = {
        cosmicrafts: process.env.CANISTER_ID_COSMICRAFTS,
      };

      this.principalId = identity.getPrincipal().toText();
      this.user = { publicKey, privateKey };

      this.saveStateToLocalStorage();
      router.push({ path: '/dashboard' });
    },
    async initializeAdditionalActor(canisterId, idlFactory) {
      if (!this.user) {
        throw new Error("User is not authenticated");
      }

      const identity = Ed25519KeyIdentity.fromKeyPair(
        base64ToUint8Array(this.user.publicKey),
        base64ToUint8Array(this.user.privateKey)
      );

      const agent = new HttpAgent({ identity, host: 'https://ic0.app' });

      if (process.env.DFX_NETWORK !== "ic") {
        agent.fetchRootKey().catch((err) => {
          console.warn(
            "Unable to fetch root key. Check to ensure that your local replica is running"
          );
          console.error(err);
        });
      }
      return Actor.createActor(idlFactory, { agent, canisterId });
    },
    saveStateToLocalStorage() {
      const authData = {
        user: this.user,
        isAuthenticated: this.isAuthenticated,
        googleSub: this.googleSub,
        principalId: this.principalId,
        authClient: this.authClient ? true : false,
      };
      localStorage.setItem('authStore', JSON.stringify(authData));
    },
    async logout() {
      this.user = null;
      this.isAuthenticated = false;
      this.googleSub = '';
      this.principalId = '';
      this.cosmicrafts = null;
      localStorage.removeItem('authStore');
    }
  },
});

export default useAuthStore;

function base64ToUint8Array(base64) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}