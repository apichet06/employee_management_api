const express = require('express');
const EmployeeController = require('../controllers/employeesController');
const Auth = require('../middleware/auth');

const router = express.Router()
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' })

router.post("/login", EmployeeController.login);
router.get("/", EmployeeController.getEmployee);
router.post("/", Auth.authenticateToken, upload.single('e_image'), EmployeeController.createEmployee);
router.put("/:e_id", Auth.authenticateToken, upload.single('e_image'), EmployeeController.updateEmployee);
router.delete("/:e_id", Auth.authenticateToken, EmployeeController.deleteEmployee);

module.exports = router

