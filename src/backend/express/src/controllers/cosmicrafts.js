import cosmicraftsCanister from '../services/motoko/main.js';

const CosmicraftsController = {
  
  registerPlayer: async (req, res) => {
    const { userId, username, avatarId } = req.body;
    if (!userId || !username || avatarId === undefined) {
      return res.status(400).json({ error: 'Missing parameters' });
    }
    try {
      const result = await cosmicraftsCanister.registerPlayer(
        userId, 
        username, 
        avatarId
      );
      res.json(result);
    } catch (error) {
      console.error(`Error registering player:`, error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  // Define other methods here
};
export default CosmicraftsController;