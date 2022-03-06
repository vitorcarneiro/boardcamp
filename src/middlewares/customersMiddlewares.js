import createCustomerSchema from "../schemas/customersSchemas.js";

export function createCustomerValidationMiddleware(req, res, next) {
  const customer = req.body;
  const dateRegex = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/;

  if (customer.cpf?.length !== 11) { return res.status(400).send("cpf must have 11 characters") }
  if (customer.phone?.length < 10 || customer.phone?.length > 11) { return res.status(400).send("phone must have 10 or 11 characters") }
  if (!customer.name) { return res.status(400).send("name must have at least 2 characters") }
  if(!dateRegex.test(customer.birthday)) { return res.status(400).send("birthday must be a valid date")}

  const validation = createCustomerSchema.validate(customer);
  if (validation.error) { return res.sendStatus(422) }
  next();
}