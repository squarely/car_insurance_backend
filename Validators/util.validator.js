import { body, validationResult } from 'express-validator';

const validator = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array().map(e => ({ message: e.msg })) });
    }
    next()
}

export default validator;