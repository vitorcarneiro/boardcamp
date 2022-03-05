import Joi from "joi";

const createCategorySchema = Joi.object({
    name: Joi.string().min(3).required(),
});

export default createCategorySchema;