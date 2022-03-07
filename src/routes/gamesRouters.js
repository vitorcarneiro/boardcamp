import { Router } from "express";
import { readGames, createGame } from "../controllers/gamesControllers.js"
import { createGameValidationMiddleware } from "../middlewares/gamesMiddlewares.js"

const gamesRouters = Router();
gamesRouters.get("/games", readGames);
gamesRouters.post("/games", createGameValidationMiddleware, createGame)

export default gamesRouters;