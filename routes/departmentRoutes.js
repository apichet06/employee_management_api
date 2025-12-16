const express = require('express')

const departmentController = require('../controllers/departmentController')
const auth = require('../middleware/auth')


const routes = express.Router()
routes.get('/', departmentController.getDepartment)
routes.post('/', auth.authenticateToken, departmentController.createDepartment)
routes.put('/:d_id', departmentController.updateDepartment)
routes.delete('/:d_id', departmentController.deleteDepartment)

module.exports = routes