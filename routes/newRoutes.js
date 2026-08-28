const express = require('express')
const NewsController = require('../controllers/newsController')
const Auth = require('../middleware/auth')

const routes = express.Router()
routes.get('/', NewsController.getNews)
routes.post('/', Auth.authenticateToken, Auth.authorizeRoles('admin', 'subadmin'), NewsController.createNews)
routes.put('/:n_id', Auth.authenticateToken, Auth.authorizeRoles('admin', 'subadmin'), NewsController.updateNews)
routes.delete('/:n_id', Auth.authenticateToken, Auth.authorizeRoles('admin', 'subadmin'), NewsController.deleteNews)
routes.get('/:n_id', NewsController.getNewsById)

module.exports = routes
