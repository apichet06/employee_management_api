const express = require('express')
const PostionController = require('../controllers/positionController')


const router = express.Router()

router.get('/', PostionController.getPosition)
router.post('/', PostionController.createPosition)
router.put('/:p_id', PostionController.updatePosition)
router.delete('/:p_id', PostionController.deletePosition)

module.exports = router