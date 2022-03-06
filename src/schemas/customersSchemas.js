import Joi from "joi";

const createCustomerSchema = Joi.object({
    name: Joi.string().min(2).required(),
    phone: Joi.string().required(),
    cpf: Joi.string().required(),
    birthday: Joi.string().required()
});

export default createCustomerSchema;