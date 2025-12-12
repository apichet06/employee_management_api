const express = require('express')
const WebsiteController = require('../controllers/websiteController')

const multer = require('multer');
const upload = multer({ dest: 'uploads/' })

const routes = express.Router()
routes.get('/', WebsiteController.getWebsite)
routes.post('/', upload.single('w_image'), WebsiteController.createWebsite)
routes.put('/:w_id', upload.single('w_image'), WebsiteController.updateWebsite)
routes.delete('/:w_id', WebsiteController.deleteWebsite)


module.exports = routes