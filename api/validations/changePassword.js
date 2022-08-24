const Joi = require('joi');

module.exports = Joi.object({
    email: Joi.string()
            .email({ minDomainSegments: 2 })
            .required(),
    newPassword: Joi.string().required()
        .messages({
            'string.base': `"New Password" should be a type of 'text'`,
            'string.empty': `"New Password" cannot be an empty field`,
            'any.required': `"New Password" is a required field`
        }),
    oldPassword: Joi.string().required()
        .messages({
            'string.base': `"Old Password" should be a type of 'text'`,
            'string.empty': `"Old Password" cannot be an empty field`,
            'any.required': `"Old Password" is a required field`
        }),
});