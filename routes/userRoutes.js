const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const UserController = require('../controllers/userController');
const { isAuthenticated, authorizeRoles } = require('../middleware/Auth');


router.put('/users/password/:id', UserController.changepassword);
router.post('/register', UserController.registerUser)

router.post('/login', UserController.isLogin)

router.get('/logout', UserController.Logout)
router.post('/otp', UserController.verifyOtp)
router.post('/forgetpasssword', UserController.forgotPassword)

router.put('/password/reset/:token', UserController.resetPassword)

router.get('/me', isAuthenticated, UserController.getUserDetails)

router.put('/updatepassword', isAuthenticated, UserController.updatePassword)

router.put('/me/updateProfile', isAuthenticated, UserController.updateUserProfile)

// router.get('/admin/users', isAuthenticated, authorizeRoles('admin'), UserController.allUser)
router.get('/admin/users', UserController.allUser)

router.get('/admin/users/:id', isAuthenticated, authorizeRoles('admin'), UserController.getDetails)



router.put('/admin/user/update/:id', isAuthenticated, UserController.updateUser)

router.delete('/admin/user/delete/:id', isAuthenticated, authorizeRoles('admin'), UserController.deleteUser)


module.exports = router