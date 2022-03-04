import { Router } from 'express';
import getGamesRouter from "./gamesRouters.js";

const router = Router();
router.use(getGamesRouter);

export default router;