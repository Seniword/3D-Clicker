import express from "express";
const router = express.Router()

import HomeController from './controllers/HomeController.js'
import LogTypeController from './controllers/LogTypeController.js'
import SignupController from './controllers/SignupController.js'
import SigninController from './controllers/SigninController.js'
import ClassSelectionController from './controllers/ClassSelectionController.js'
import AchievementController from './controllers/AchievementController.js'

router.get('/', HomeController)
router.post('/logType', LogTypeController)
router.post('/signup', SignupController)
router.post('/signin', SigninController)
router.post('/classSelection', ClassSelectionController)
router.post('/getAchievement', AchievementController)

export default router