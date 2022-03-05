import { Router } from 'express';
import { getCategoriesRouter, createCategoryRouter } from "./categoriesRouters.js";     
import { getGamesRouter, createGamesRouter } from "./gamesRouters.js";     

const router = Router();

router.use(getCategoriesRouter);
router.use(createCategoryRouter);

router.use(getGamesRouter);
router.use(createGamesRouter);

export default router;