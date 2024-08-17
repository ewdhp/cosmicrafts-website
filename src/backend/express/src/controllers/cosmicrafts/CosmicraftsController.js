import 'dotenv/config';
import { createActor, callActorFunction } from '../../apis/cosmicrafts/actor.js';
import { parseBigIntAndPrincipalValues } from '../../apis/cosmicrafts/utils.js';

const CANISTER_ID = process.env.COSMICRAFTS_CANISTER_ID;

const registerPlayer = async (userId, username, avatarId) => {
  const actor = await createActor(userId, CANISTER_ID);
  const result = await callActorFunction(actor, 'registerPlayer', username, avatarId);
  return parseBigIntAndPrincipalValues(result);
};

const registerPlayerHandler = async (req, res) => {
  const { userId, username, avatarId } = req.body;
  if (!userId || !username || avatarId === undefined) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    const result = await registerPlayer(userId, username, avatarId);
    res.json(result);
  } catch (error) {
    console.error(`Error registering player:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Define other controller methods similarly...

const cosmicraftsController = {
  registerPlayer: registerPlayerHandler,
  // Define other methods here
};

export default cosmicraftsController;
