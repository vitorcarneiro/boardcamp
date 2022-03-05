import createGameSchema from "../schemas/gamesSchemas.js";

export function createGameValidationMiddleware(req, res, next) {
  const game = req.body;

  if (!game.name) { return res.sendStatus(400) }

  const validation = createGameSchema.validate(game);
  if (validation.error) { return res.sendStatus(422) }
  next();
}