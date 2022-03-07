import createRentalSchema from "../schemas/rentalsSchemas.js";

export function createRentalValidationMiddleware(req, res, next) {
    const rental = req.body;

    if (rental.daysRented <= 0) { return res.status(400).send("days rented must be higher than 0") }

    const validation = createRentalSchema.validate(rental);
    if (validation.error) { return res.sendStatus(422) }
    next();
}