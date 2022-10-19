import express from "express";
const router = express.Router()

import HomeController from './controllers/HomeController.js'
import SignupController from './controllers/SignupController.js'
import SigninController from './controllers/SigninController.js'
import ClassSelectionController from './controllers/ClassSelectionController.js'
import AchievementController from './controllers/AchievementController.js'
import AuthenticateToken from "./middlewares/authenticateToken.js";
import AuthController from "./controllers/AuthController.js";

router.get('/', HomeController)
router.post('/signup', SignupController)
router.post('/signin', SigninController)
router.post('/classSelection', AuthenticateToken, ClassSelectionController)
router.post('/getAchievement', AuthenticateToken, AchievementController)
router.get('/isAuth', AuthenticateToken, AuthController)

export default router