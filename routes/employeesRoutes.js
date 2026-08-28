const express = require('express');
const EmployeeController = require('../controllers/employeesController');
const Auth = require('../middleware/auth');

const router = express.Router()
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' })

router.post("/login/:websiteId", EmployeeController.login);
router.get("/birthday", EmployeeController.getBrithday)
router.get("/", Auth.authenticateToken, EmployeeController.getEmployeeAndResignAll); //ไม่แสดงคนลาออก
router.get("/all", Auth.authenticateToken, EmployeeController.getEmployeeAll); // แสดงรวมคนลาออก
router.post("/scan-tokens", Auth.authenticateToken, Auth.authorizeRoles("admin", "subadmin"), EmployeeController.createScanTokens);
router.post("/", Auth.authenticateToken, Auth.authorizeRoles("admin", "subadmin"), upload.fields([
    { name: "e_image", maxCount: 1 },
    { name: "e_signature", maxCount: 1 },
]), EmployeeController.createEmployee);
router.put("/:e_id", Auth.authenticateToken, Auth.authorizeRoles("admin", "subadmin"), upload.fields([
    { name: "e_image", maxCount: 1 },
    { name: "e_signature", maxCount: 1 },
]), EmployeeController.updateEmployee);
router.delete("/:e_id", Auth.authenticateToken, Auth.authorizeRoles("admin", "subadmin"), EmployeeController.deleteEmployee);
router.put("/reset-password/:e_id", Auth.authenticateToken, Auth.authorizeRoles("admin", "subadmin"), EmployeeController.resetPassword);
router.get("/scan/:token", EmployeeController.getScanEmployeeById)
router.put("/change-password/:e_id", Auth.authenticateToken, Auth.authorizeSelf("e_id"), EmployeeController.setNewPassword)
router.get("/:emp", Auth.authenticateToken, EmployeeController.getEmployeeAccount)


module.exports = router
