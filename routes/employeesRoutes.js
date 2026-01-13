const express = require('express');
const EmployeeController = require('../controllers/employeesController');
const Auth = require('../middleware/auth');

const router = express.Router()
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' })

router.post("/login", EmployeeController.login);
router.get("/", Auth.authenticateToken, EmployeeController.getEmployeeAndResignAll); //ไม่แสดงคนลาออก
router.get("/all", Auth.authenticateToken, EmployeeController.getEmployeeAll); // แสดงรวมคนลาออก
router.post("/", Auth.authenticateToken, upload.fields([
    { name: "e_image", maxCount: 1 },
    { name: "e_signature", maxCount: 1 },
]), EmployeeController.createEmployee);
router.put("/:e_id", Auth.authenticateToken, upload.fields([
    { name: "e_image", maxCount: 1 },
    { name: "e_signature", maxCount: 1 },
]), EmployeeController.updateEmployee);
router.delete("/:e_id", Auth.authenticateToken, EmployeeController.deleteEmployee);
router.put("/reset-password/:e_id", Auth.authenticateToken, EmployeeController.resetPassword);
router.get("/scan/:e_usercode", EmployeeController.getScanEmployeeById)
router.put("/change-password/:e_id", Auth.authenticateToken, EmployeeController.setNewPassword)
module.exports = router

