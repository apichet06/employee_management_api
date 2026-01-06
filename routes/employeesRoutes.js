const express = require('express');
const EmployeeController = require('../controllers/employeesController');
const Auth = require('../middleware/auth');

const router = express.Router()
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' })

router.post("/login", EmployeeController.login);
router.get("/", Auth.authenticateToken, EmployeeController.getEmployee);
router.post("/", Auth.authenticateToken, upload.single('e_image'), EmployeeController.createEmployee);
router.put("/:e_id", Auth.authenticateToken, upload.single('e_image'), EmployeeController.updateEmployee);
router.delete("/:e_id", Auth.authenticateToken, EmployeeController.deleteEmployee);
router.put("/reset-password/:e_id", Auth.authenticateToken, EmployeeController.resetPassword);

module.exports = router

