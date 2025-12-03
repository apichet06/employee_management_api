const Messages = require('../config/messages');
const WebsiteModel = require('../models/websiteModel');



class WebsiteController {

    static async getWebsite(req, res) {
        try {
            const Website = await WebsiteModel.getWebsiteAll()
            if (Website)
                res.status(200).json({ status: "ok", data: Website })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }
}

module.exports = WebsiteController;