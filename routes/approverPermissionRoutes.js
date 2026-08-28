const express = require('express');
const Auth = require('../middleware/auth');
const ApproverPermissionContoller = require('../controllers/approverPermissionController');

const router = express.Router()


router.get('/', Auth.authenticateToken, Auth.authorizeRoles('admin'), ApproverPermissionContoller.getApproverPermission)
router.post('/', Auth.authenticateToken, Auth.authorizeRoles('admin'), ApproverPermissionContoller.createApproverPermission)
router.put('/:ap_id', Auth.authenticateToken, Auth.authorizeRoles('admin'), ApproverPermissionContoller.updateApproverPermission)
router.delete('/:ap_id', Auth.authenticateToken, Auth.authorizeRoles('admin'), ApproverPermissionContoller.deleteApproverPermission)

module.exports = router;
