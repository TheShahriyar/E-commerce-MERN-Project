const express = require('express');
const { getUsers, getUserById, deleteUserById, processRegister, activateUserAccount } = require('../controllers/userController');
const userRouter = express.Router();

userRouter.get('/', getUsers);
userRouter.get('/:id', getUserById);
userRouter.delete('/:id', deleteUserById);
userRouter.post('/process-register', processRegister);
userRouter.post('/verify', activateUserAccount);

module.exports = userRouter;