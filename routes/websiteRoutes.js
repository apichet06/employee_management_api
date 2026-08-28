const express = require('express')
const WebsiteController = require('../controllers/websiteController')

const multer = require('multer');
const Auth = require('../middleware/auth');
const upload = multer({ dest: 'public/uploads/' })

const routes = express.Router()
routes.get('/', WebsiteController.getWebsite)
routes.post('/', Auth.authenticateToken, Auth.authorizeRoles('admin'), upload.single('w_image'), WebsiteController.createWebsite)
routes.put('/:w_id', Auth.authenticateToken, Auth.authorizeRoles('admin'), upload.single('w_image'), WebsiteController.updateWebsite)
routes.delete('/:w_id', Auth.authenticateToken, Auth.authorizeRoles('admin'), WebsiteController.deleteWebsite)


module.exports = routes
