import { Router } from "express";
import { createCustomer, readCustomers, getCustomer, updateCustomer } from "../controllers/customersControllers.js"
import { createCustomerValidationMiddleware } from "../middlewares/customersMiddlewares.js"

const customersRouters = Router();
customersRouters.post("/customers", createCustomerValidationMiddleware, createCustomer);
customersRouters.get("/customers", readCustomers);
customersRouters.get('/customers/:id', getCustomer);
customersRouters.put('/customers/:id', createCustomerValidationMiddleware, updateCustomer);

export default customersRouters;