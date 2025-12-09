const express = require('express')
const NewsController = require('../controllers/newsController')

const routes = express.Router()
routes.get('/', NewsController.getNews)
routes.post('/', NewsController.createNews)
routes.put('/:n_id', NewsController.updateNews)
routes.delete('/:n_id', NewsController.deleteNews)
routes.get('/:n_id', NewsController.getNewsById)

module.exports = routes