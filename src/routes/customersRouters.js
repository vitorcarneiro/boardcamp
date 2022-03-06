import { Router } from "express";
import { createCustomer, readCustomers, getCustomer } from "../controllers/customersControllers.js"
import { createCustomerValidationMiddleware } from "../middlewares/customersMiddlewares.js"

const customerRouter = Router();
customerRouter.post("/customers", createCustomerValidationMiddleware, createCustomer);
customerRouter.get("/customers", readCustomers);
customerRouter.get('/customers/:id', getCustomer);

export default customerRouter;