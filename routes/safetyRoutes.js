const express = require('express')
const multer = require('multer')

const auth = require('../middleware/auth')
const safetyController = require('../controllers/safetyController')

const upload = multer({
    dest: 'public/uploads/',
    limits: { fileSize: 20 * 1024 * 1024 },
})

const routes = express.Router()

routes.get('/', auth.authenticateToken, auth.authorizeRoles('admin', 'subadmin'), safetyController.getSafetyDocument)
routes.post('/upload', auth.authenticateToken, auth.authorizeRoles('admin', 'subadmin'), upload.single('file'), safetyController.uploadSafetyDocument)

module.exports = routes
