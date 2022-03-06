import { Router } from 'express';
import { getCategoriesRouter, createCategoryRouter } from "./categoriesRouters.js";     
import { getGamesRouter, createGamesRouter } from "./gamesRouters.js";     
import { createCustomerRouter, readCustomerRouter } from "./customersRouters.js";     

const router = Router();

router.use(createCategoryRouter);
router.use(getCategoriesRouter);

router.use(createGamesRouter);
router.use(getGamesRouter);

router.use(createCustomerRouter);
router.use(readCustomerRouter);

export default router;