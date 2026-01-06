const express = require('express')

const departmentController = require('../controllers/departmentController')
const auth = require('../middleware/auth')


const routes = express.Router()
routes.get('/', auth.authenticateToken, departmentController.getDepartment)
routes.post('/', auth.authenticateToken, departmentController.createDepartment)
routes.put('/:d_id', auth.authenticateToken, departmentController.updateDepartment)
routes.delete('/:d_id', auth.authenticateToken, departmentController.deleteDepartment)

module.exports = routes