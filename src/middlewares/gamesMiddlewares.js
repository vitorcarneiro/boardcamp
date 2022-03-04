import { createGameSchema } from "../schemas/gamesSchemas.js";

export function createGameValidationMiddleware(req, res, next) {
  const game = req.body;
  const validation = createGameSchema.validate(game);
  if (validation.error) {
    return res.sendStatus(422);
  }
  next();
}