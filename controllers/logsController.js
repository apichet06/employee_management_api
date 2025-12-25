const Messages = require("../config/messages");
const logModel = require("../models/logsModlel");

class LogsController {

    static async lostList(req, res) {
        try {

            const data = await logModel.list()

            if (data)
                res.status(200).json({ status: "ok", data: data })

        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }
    }


}

module.exports = LogsController;