const Joi = require('joi');

module.exports = Joi.object({
    email: Joi.string()
            .email({ minDomainSegments: 2 })
            .required(),
    password: Joi.string()
            /*.pattern(
                new RegExp(
                "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
                )
            )*/
            .required(),
});