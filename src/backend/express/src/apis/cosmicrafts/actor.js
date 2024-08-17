import { Actor, HttpAgent } from '@dfinity/agent';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { idlFactory as cosmicraftsIdlFactory } from '../../../declarations/cosmicrafts/cosmicrafts.did.js';
import { generateKeysFromSub, base64Decode } from './utils.js';

const createActor = async (userId, CANISTER_ID) => {
  const { publicKeyBase64, privateKeyBase64 } = await generateKeysFromSub(userId);
  const identity = Ed25519KeyIdentity.fromKeyPair(
    base64Decode(publicKeyBase64),
    base64Decode(privateKeyBase64)
  );
  const agent = new HttpAgent({ identity, host: 'https://ic0.app' });
  if (process.env.NODE_ENV !== 'production') {
    await agent.fetchRootKey();
  }
  return Actor.createActor(cosmicraftsIdlFactory, { agent, canisterId: CANISTER_ID });
};

const createPublicActor = async (CANISTER_ID) => {
  const agent = new HttpAgent({ host: 'https://ic0.app' });
  if (process.env.NODE_ENV !== 'production') {
    await agent.fetchRootKey();
  }
  return Actor.createActor(cosmicraftsIdlFactory, { agent, canisterId: CANISTER_ID });
};

const callActorFunction = async (actor, functionName, ...args) => {
  try {
    const result = await actor[functionName](...args);
    return result;
  } catch (error) {
    console.error(`Error calling ${functionName}:`, error);
    throw new Error('Internal Server Error');
  }
};

export { createActor, createPublicActor, callActorFunction };
