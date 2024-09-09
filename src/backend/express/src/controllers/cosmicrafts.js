import cc from '../services/motoko/main.js';

const CController = {
  
registerPlayer: async (req, res) => {
    const { userId, username, avatarId } = req.body;

    try {
      const result = await cc.registerPlayer(userId, username, avatarId);
      res.json(result);
    } catch (error) {
      console.error(`Error registering player:`, error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
   ref_id_gen: async (req, res) => {

    try {
      const result = await cc.ref_id_gen();
      res.json(result);
    } catch (error) {
      console.error(`Error ref_id_gen:`, error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

};
export default CController;