import { Router } from "express";
import { readCategories, createCategory } from "../controllers/categoriesControllers.js"
import { createCategoryValidationMiddleware } from "../middlewares/categoriesMiddlewares.js"

const categoriesRouters = Router();
categoriesRouters.get("/categories", readCategories);
categoriesRouters.post("/categories", createCategoryValidationMiddleware, createCategory)

export default categoriesRouters;