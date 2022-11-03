import express from "express";
const router = express.Router()

import HomeController from './controllers/HomeController.js'
import SignupController from './controllers/SignupController.js'
import SigninController from './controllers/SigninController.js'
import ClassSelectionController from './controllers/ClassSelectionController.js'
import AchievementController from './controllers/AchievementController.js'
import AuthenticateToken from "./middlewares/authenticateToken.js";
import {getMoney, setMoney} from "./controllers/MoneyController.js";
import saveUserController from "./controllers/SaveUserController.js";
import findMonsterStats from "./controllers/monsterStatsController.js";
import {getWeapons, getWeaponData, setWeapons} from "./controllers/WeaponsController.js";

router.get('/', HomeController)
router.post('/signup', SignupController)
router.post('/signin', SigninController)
router.post('/classSelection', AuthenticateToken, ClassSelectionController)
router.post('/addAchievement', AuthenticateToken, AchievementController)
router.get('/getMoney', AuthenticateToken, getMoney)
router.post('/setMoney', AuthenticateToken, setMoney)
router.get('/getWeapons', AuthenticateToken, getWeapons)
router.post('/getWeaponData', AuthenticateToken, getWeaponData)
router.post('/setWeapons', AuthenticateToken, setWeapons)
router.post('/saveUserInfos', AuthenticateToken, saveUserController)
router.post('/getMonsterStats', AuthenticateToken, findMonsterStats)

export default router