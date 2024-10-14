import { body } from 'express-validator';

export const createValidator = [
    body('username')
        .exists().withMessage('username is required')
        .isString().withMessage('username must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('username must be between 3 to 50 characters long'),
    body('email')
        .exists().withMessage('email is required')
        .isEmail().withMessage('Please enter a valid phonenumber'),
    body('password')
        .exists().withMessage('password is required')
        .isStrongPassword().withMessage('Please enter a valid password'),
]

const UserValidator = {
    createValidator
};

export default UserValidator;