const express = require('express')

const holidayController = require('../controllers/holidaysController')

const routes = express.Router()
routes.get('/', holidayController.getHoliday)

module.exports = routes