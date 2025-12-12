const express = require('express')
const multer = require('multer');
const holidayController = require('../controllers/holidaysController')

const router = express.Router()
const upload = multer({ dest: 'uploads/' });


router.get('/', holidayController.getHoliday)
router.post('/', holidayController.createHoliday)
router.put('/:h_id', holidayController.updateHoliday)
router.delete('/:h_id', holidayController.deleteHoliday)
router.post('/import', upload.single('file'), holidayController.importHoliday);
module.exports = router