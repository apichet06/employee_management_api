const Messages = require('../config/messages');
const NewsModel = require('../models/newsModel');


class NewsController {

    static async getNews(req, res) {
        try {
            const News = await NewsModel.getNewsAll()
            if (News)
                res.status(200).json({ status: "ok", data: News })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }

    static async createNews(req, res) {
        try {
            const { n_title, n_message, e_id = 1 } = req.body
            const reqData = [n_title, n_message, e_id]

            const News = await NewsModel.create(reqData)
            res.status(200).json({ status: Messages.ok, message: Messages.insertSuccess, News })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }

    static async updateNews(req, res) {
        try {
            const { n_title, n_message, n_id } = req.body
            const reqData = [n_title, n_message, n_id]

            const News = await NewsModel.update(reqData)
            res.status(200).json({ status: Messages.ok, message: Messages.updateSuccess, News })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }

    static async deleteNews(req, res) {
        try {

            const { n_id } = req.params
            const reqData = [n_id]
            const News = await NewsModel.delete(reqData)
            res.status(200).json({ status: Messages.ok, message: Messages.deleteSuccess, News })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }

    }

    static async getNewsById(req, res) {
        try {
            const { n_id } = req.params
            const reqData = [n_id]

            const News = await NewsModel.getNewsById(reqData)
            res.status(200).json({ status: "ok", data: News })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }
}

module.exports = NewsController;