const express = require('express')
const multer = require('multer')

const auth = require('../middleware/auth')
const safetyController = require('../controllers/safetyController')

const upload = multer({
    dest: 'public/uploads/',
    limits: { fileSize: 20 * 1024 * 1024 },
})

const routes = express.Router()

routes.get('/', auth.authenticateToken, safetyController.getSafetyDocument)
routes.post('/upload', auth.authenticateToken, upload.single('file'), safetyController.uploadSafetyDocument)

module.exports = routes
