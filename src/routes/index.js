import { Router } from 'express';
import categoriesRouters from "./categoriesRouters.js";     
import gamesRouters from "./gamesRouters.js";     
import customersRouters from "./customersRouters.js";   
import rentalsRouters from './rentalsRouters.js';  

const router = Router();
router.use(categoriesRouters);
router.use(gamesRouters);
router.use(customersRouters);
router.use(rentalsRouters);

export default router;