const Messages = require('../config/messages');
const HolidayModel = require('../models/holidaysModel');


class HolidayController {

    static async getHoliday(req, res) {
        try {
            const holiday = await HolidayModel.getHolidayAll()
            if (holiday)
                res.status(200).json({ status: "ok", data: holiday })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }
}

module.exports = HolidayController;