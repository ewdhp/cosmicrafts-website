import express from 'express';
import CController from '../controllers/cosmicrafts.js';

const cRouter = express.Router();

cRouter.post('/registerPlayer',CController.registerPlayer);
cRouter.post('/ref_id_gen',CController.ref_id_gen);

export default cRouter;