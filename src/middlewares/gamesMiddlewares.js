import createGameSchema from "../schemas/gamesSchemas.js";

export function createGameValidationMiddleware(req, res, next) {
  const game = req.body;

  const positiveNumberRegex = /^[0-9]*$/;

  if (!game.name) { return res.status(400).send("name must have at least 3 characters") }
  if (!positiveNumberRegex.test(game.stockTotal)) { return res.status(400).send("total stock must be a positive number") }
  if (!positiveNumberRegex.test(game.pricePerDay)) { return res.status(400).send("price per day must be a positive number") }

  const validation = createGameSchema.validate(game);
  if (validation.error) { return res.sendStatus(422) }
  next();
}