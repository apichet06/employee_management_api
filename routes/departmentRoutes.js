const express = require('express')

const departmentController = require('../controllers/departmentController')

const routes = express.Router()
routes.get('/', departmentController.getDepartment)

module.exports = routes