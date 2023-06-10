import * as joi from 'joi';

export const createUserSchema = joi.object({
  username: joi.string().alphanum().min(3).max(30).required(),
  email: joi.string().email({ minDomainSegments: 2 }),
  password: joi.string().min(5).max(50),
});
