import { Router } from "express";
import { readGames, createGame } from "../controllers/gamesControllers.js"
import { createGameValidationMiddleware } from "../middlewares/gamesMiddlewares.js"

const getGamesRouter = Router();
getGamesRouter.get("/games", readGames);

const createGamesRouter = Router();
createGamesRouter.post("/games", createGameValidationMiddleware, createGame)

export { getGamesRouter, createGamesRouter };