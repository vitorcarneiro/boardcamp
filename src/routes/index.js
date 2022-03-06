import { Router } from 'express';
import { getCategoriesRouter, createCategoryRouter } from "./categoriesRouters.js";     
import { getGamesRouter, createGamesRouter } from "./gamesRouters.js";     
import customerRouter from "./customersRouters.js";     

const router = Router();

router.use(createCategoryRouter);
router.use(getCategoriesRouter);

router.use(createGamesRouter);
router.use(getGamesRouter);

router.use(customerRouter);

export default router;