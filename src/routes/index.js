import { Router } from 'express';
import { getGamesRouter, createGamesRouter } from "./gamesRouters.js";

const router = Router();
router.use(getGamesRouter);
router.use(createGamesRouter);

export default router;