import { Router } from "express";
import { readCategories, createCategory } from "../controllers/categoriesControllers.js"
import { createCategoryValidationMiddleware } from "../middlewares/categoriesMiddlewares.js"

const getCategoriesRouter = Router();
getCategoriesRouter.get("/categories", readCategories);

const createCategoryRouter = Router();
createCategoryRouter.post("/categories", createCategoryValidationMiddleware, createCategory)

export { getCategoriesRouter, createCategoryRouter };