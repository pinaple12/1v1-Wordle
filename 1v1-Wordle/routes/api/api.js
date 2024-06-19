import express from 'express';
var router = express.Router();

import userRouter from './controllers/user.js';
import gameRouter from './controllers/game.js';

router.use('/user', userRouter);
router.use('/games', gameRouter);

export default router;