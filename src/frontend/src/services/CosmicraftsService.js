import { Actor, HttpAgent, ActorSubclass } from '@dfinity/agent';
import { cosmicrafts } from '@/declarations/cosmicrafts';
import Principal from '@dfinity/principal';

export const fetchPlayerData = async (canisterId, account) => {
  const agent = new HttpAgent();
  const actor = Actor.createActor(cosmicrafts, { agent, canisterId });

  return await actor.getPlayerData(account);
};

// Add other service functions as needed
