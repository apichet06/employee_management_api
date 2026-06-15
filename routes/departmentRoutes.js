const express = require('express')

const departmentController = require('../controllers/departmentController')
const auth = require('../middleware/auth')
const multer = require('multer')
const upload = multer({ dest: 'public/uploads/' })


const routes = express.Router()
routes.get('/', auth.authenticateToken, departmentController.getDepartment)
routes.post('/', auth.authenticateToken, upload.single('d_image'), departmentController.createDepartment)
routes.put('/:d_id', auth.authenticateToken, upload.single('d_image'), departmentController.updateDepartment)
routes.delete('/:d_id', auth.authenticateToken, departmentController.deleteDepartment)

module.exports = routes
