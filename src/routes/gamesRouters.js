import { Router } from "express";
import { getGames } from "../controllers/gamesControllers.js"

const getGamesRouter = Router();
getGamesRouter.get("/games", getGames);

export default getGamesRouter;