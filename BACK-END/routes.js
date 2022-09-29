import express from "express";
const router = express.Router()

import HomeController from 'controllers/HomeController.js'

router.get('/', HomeController)