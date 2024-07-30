const { Router } = require('express');
const { getUsers, register, login, protected, logout, deleteItem, addItem, changePassword, exportAccounts } = require('../exports/exports');
const { registerValidation, loginValidation, newPassword } = require('../validators/auth');
const { validationMiddleware } = require('../middlewares/validations-middleware');
const { userAuth } = require('../middlewares/passport-midleware');
const router = Router();

router.get('/get-users', getUsers);
router.get('/protected', userAuth, protected);
router.get('/export-accounts', userAuth, exportAccounts);
router.delete('/deleteItem', userAuth, deleteItem);
router.post('/addItem', userAuth, addItem);
router.post('/register', registerValidation, validationMiddleware, register);
router.post('/login', loginValidation, validationMiddleware, login);
router.post('/changePassword', userAuth, newPassword, validationMiddleware, changePassword);
router.get('/logout', logout);

module.exports = router;