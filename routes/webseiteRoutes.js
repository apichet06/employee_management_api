const express = require('express')
const WebsiteController = require('../controllers/websiteController')


const routes = express.Router()
routes.get('/', WebsiteController.getWebsite)

module.exports = routes