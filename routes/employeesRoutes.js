const express = require('express');
const EmployeeController = require('../controllers/employeesController');
const Auth = require('../middleware/auth');

const router = express.Router()

router.post("/login", EmployeeController.login);
router.get("/", EmployeeController.getEmployee);
router.post("/", Auth.authenticateToken, EmployeeController.createEmployee);
router.put("/:e_id", Auth.authenticateToken, EmployeeController.updateEmployee);
router.delete("/:e_id", Auth.authenticateToken, EmployeeController.deleteEmployee);

module.exports = router

