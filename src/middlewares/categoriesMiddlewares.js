import createCategorySchema from "../schemas/categoriesSchemas.js";

export function createCategoryValidationMiddleware(req, res, next) {
  const category = req.body;

  if (!category.name) { return res.sendStatus(400) }

  const validation = createCategorySchema.validate(category);
  if (validation.error) { return res.sendStatus(422) }
  next();
}