import { Router } from "express";
import { createCustomer, readCustomers } from "../controllers/customersControllers.js"
import { createCustomerValidationMiddleware } from "../middlewares/customersMiddlewares.js"

const createCustomerRouter = Router();
createCustomerRouter.post("/customers", createCustomerValidationMiddleware, createCustomer);

const readCustomerRouter = Router();
readCustomerRouter.get("/customers", readCustomers);

export { createCustomerRouter, readCustomerRouter };