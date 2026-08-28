const express = require('express');
const router = express.Router();



const auth = require('../middleware/auth');
const employeesRolesController = require('../controllers/employeesRolesController');

router.get('/', auth.authenticateToken, auth.authorizeRoles('admin'), employeesRolesController.getRoles);
router.get('/status', auth.authenticateToken, auth.authorizeRoles('admin'), employeesRolesController.getRolesStatus);
router.post('/', auth.authenticateToken, auth.authorizeRoles('admin'), employeesRolesController.createRoles);
router.put('/:er_id', auth.authenticateToken, auth.authorizeRoles('admin'), employeesRolesController.updateRoles);
router.delete('/:er_id', auth.authenticateToken, auth.authorizeRoles('admin'), employeesRolesController.deleteRoles);


module.exports = router;
