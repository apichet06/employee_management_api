const express = require('express')
const multer = require('multer');
const holidayController = require('../controllers/holidaysController');
const Auth = require('../middleware/auth');

const router = express.Router()
const upload = multer({ dest: 'public/uploads/' });


router.get('/', holidayController.getHoliday)
router.post('/', Auth.authenticateToken, holidayController.createHoliday)
router.put('/:h_id', Auth.authenticateToken, holidayController.updateHoliday)
router.delete('/:h_id', Auth.authenticateToken, holidayController.deleteHoliday)
router.post('/import', Auth.authenticateToken, upload.single('file'), holidayController.importHoliday);

module.exports = router