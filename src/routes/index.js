import { Router } from 'express';
import categoriesRouters from "./categoriesRouters.js";     
import gamesRouters from "./gamesRouters.js";     
import customersRouters from "./customersRouters.js";     

const router = Router();
router.use(categoriesRouters);
router.use(gamesRouters);
router.use(customersRouters);

export default router;