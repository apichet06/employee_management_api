const express = require('express');
const router = express.Router();



const auth = require('../middleware/auth');
const employeesRolesController = require('../controllers/employeesRolescontroller');


router.get('/', auth.authenticateToken, employeesRolesController.getRoles);
router.get('/status', auth.authenticateToken, employeesRolesController.getRolesStatus);
router.post('/', auth.authenticateToken, employeesRolesController.createRoles);
router.put('/:er_id', auth.authenticateToken, employeesRolesController.updateRoles);
router.delete('/:er_id', auth.authenticateToken, employeesRolesController.deleteRoles);


module.exports = router;