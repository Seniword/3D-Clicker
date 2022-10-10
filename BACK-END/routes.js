import express from "express";
const router = express.Router()

import HomeController from './controllers/HomeController.js'
import SignupController from './controllers/SignupController.js'
import SigninController from './controllers/SigninController.js'
import classSelectionController from './controllers/classSelectionController.js'

router.get('/', HomeController)
router.post('/signup', SignupController)
router.post('/signin', SigninController)
router.post('/classSelection', classSelectionController)

export default router