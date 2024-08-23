import { Actor, HttpAgent, ActorSubclass } from '@dfinity/agent';
import { cosmicrafts } from '../../../declarations/cosmicrafts';

export const fetchUserDetails = async (canisterId, account) => {
  const agent = new HttpAgent();
  const actor = Actor.createActor(cosmicrafts, { agent, canisterId });

  return await actor.getUserDetails(account);
};

// Add other service functions as needed
