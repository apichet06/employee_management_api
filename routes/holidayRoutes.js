const express = require('express')
const multer = require('multer');
const holidayController = require('../controllers/holidaysController');
const Auth = require('../middleware/auth');

const router = express.Router()
const upload = multer({ dest: 'public/uploads/' });


router.get('/', holidayController.getHoliday)
router.post('/', Auth.authenticateToken, Auth.authorizeRoles('admin', 'subadmin'), holidayController.createHoliday)
router.put('/:h_id', Auth.authenticateToken, Auth.authorizeRoles('admin', 'subadmin'), holidayController.updateHoliday)
router.delete('/:h_id', Auth.authenticateToken, Auth.authorizeRoles('admin', 'subadmin'), holidayController.deleteHoliday)
router.post('/import', Auth.authenticateToken, Auth.authorizeRoles('admin', 'subadmin'), upload.single('file'), holidayController.importHoliday);

module.exports = router
