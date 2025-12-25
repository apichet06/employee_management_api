const Messages = require("../config/messages");
const PositionModel = require("../models/positionModel");


class PostionController {
    static async getPosition(req, res) {
        try {
            const position = await PositionModel.getpositionAll()
            if (position)
                res.status(200).json({ status: "ok", data: position })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }
    static async createPosition(req, res) {
        try {
            const { p_name, p_name_th, p_name_jp } = req.body
            const reqData = [p_name, p_name_th, p_name_jp]

            const position = await PositionModel.create(reqData)
            res.status(200).json({ status: Messages.ok, message: Messages.insertSuccess, data: position })
        } catch (error) {
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ status: Messages.error, message: Messages.exists + req.body.p_name });
            }
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }

    static async updatePosition(req, res) {
        try {
            const { p_name, p_name_th, p_name_jp, p_id } = req.body
            const reqData = [p_name, p_name_th, p_name_jp, p_id]

            const position = await PositionModel.update(reqData)
            res.status(200).json({ status: Messages.ok, message: Messages.updateSuccess, data: position })
        } catch (error) {
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ status: Messages.error, message: Messages.exists + req.body.p_name });
            }
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }

    static async deletePosition(req, res) {
        try {
            const { p_id } = req.params
            const reqData = [p_id]
            const position = await PositionModel.delete(reqData)
            res.status(200).json({ status: Messages.ok, message: Messages.deleteSuccess, data: position })
        } catch (error) {
            if (error.code === "ER_ROW_IS_REFERENCED_2" || error.errno === 1451) {
                return res.status(409).json({
                    status: Messages.error, message: Messages.inUseCannotDelete, // "ข้อมูลนี้ถูกใช้อยู่ไม่สามารถลบได้"
                });
            }
            res.status(500).json({ status: Messages.error500, message: error.message });
        }


    }
}

module.exports = PostionController;

