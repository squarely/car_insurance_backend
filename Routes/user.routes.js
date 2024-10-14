import { Router } from 'express';
const router = Router();
import validator from '../Validators/util.validator.js';
import UserValidator from '../Validators/user.validator.js';
import { getUsers, postUser, getUser, updateUser, deleteUser, loginUser, getToken } from '../Controllers/user.controllers.js';

router.get('/', getUsers)
router.post('/', UserValidator.createValidator, validator, postUser)
router.get('/:id', getUser)
router.patch('/:id', updateUser)
router.delete('/:id', deleteUser)

router.post('/login', loginUser)
router.post('/token', getToken)

export default router;