const express = require('express')
const PostionController = require('../controllers/positionController')
const Auth = require('../middleware/auth')


const router = express.Router()

router.get('/', Auth.authenticateToken, PostionController.getPosition)
router.post('/', Auth.authenticateToken, Auth.authorizeRoles('admin', 'subadmin'), PostionController.createPosition)
router.put('/:p_id', Auth.authenticateToken, Auth.authorizeRoles('admin', 'subadmin'), PostionController.updatePosition)
router.delete('/:p_id', Auth.authenticateToken, Auth.authorizeRoles('admin', 'subadmin'), PostionController.deletePosition)

module.exports = router
