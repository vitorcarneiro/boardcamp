import { Router } from "express";
import { createRental } from "../controllers/rentalsControllers.js"
import { createRentalValidationMiddleware } from "../middlewares/rentalsMiddlewares.js";

const rentalsRouters = Router();
rentalsRouters.post("/rentals", createRentalValidationMiddleware, createRental);

export default rentalsRouters;