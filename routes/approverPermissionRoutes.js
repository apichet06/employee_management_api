const express = require('express');
const Auth = require('../middleware/auth');
const ApproverPermissionContoller = require('../controllers/approverPermissionController');

const router = express.Router()


router.get('/', Auth.authenticateToken, ApproverPermissionContoller.getApproverPermission)
router.post('/', Auth.authenticateToken, ApproverPermissionContoller.createApproverPermission)
router.put('/:ap_id', Auth.authenticateToken, ApproverPermissionContoller.updateApproverPermission)
router.delete('/:ap_id', Auth.authenticateToken, ApproverPermissionContoller.deleteApproverPermission)

module.exports = router;
