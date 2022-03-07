import { Router } from "express";
import { createRental, readRentals, endRental, deleteRental } from "../controllers/rentalsControllers.js"
import { createRentalValidationMiddleware } from "../middlewares/rentalsMiddlewares.js";

const rentalsRouters = Router();
rentalsRouters.post("/rentals", createRentalValidationMiddleware, createRental);
rentalsRouters.get("/rentals", readRentals);
rentalsRouters.post("/rentals/:id/return", endRental);
rentalsRouters.delete("/rentals/:id/return", deleteRental);

export default rentalsRouters;