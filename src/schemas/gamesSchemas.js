import Joi from "joi";

const createGameSchema = Joi.object({
    name: Joi.string().min(3).required(),
    image: Joi.string().pattern(new RegExp('(https?:\/\/.*\.(?:jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF))')).required(),
    stockTotal: Joi.string().required(),
    categoryId: Joi.number().positive().integer().required(),
    pricePerDay: Joi.string().required()
});

export default createGameSchema;