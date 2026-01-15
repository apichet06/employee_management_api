const Messages = require("../config/messages");
const logModel = require("../models/logsModlel");
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
            const { p_name_en, p_name_th, p_name_ja } = req.body
            const reqData = [p_name_en, p_name_th, p_name_ja]

            // log
            const logData = [`คุณ${req.user.username} ID: ${req.user.code} เพิ่มข้อมูลตำแหน่ง ${p_name_th} เรียบร้อยแล้ว`, 'Posttion']
            await logModel.create(logData)


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
            const { p_name_en, p_name_th, p_name_ja, p_id } = req.body
            const reqData = [p_name_en, p_name_th, p_name_ja, p_id]

            const position = await PositionModel.update(reqData)

            // log
            const logData = [`คุณ${req.user.username} ID: ${req.user.code} แก้ไขข้อมูลตำแหน่งใหม่เป็น ${p_name_th} เรียบร้อยแล้ว`, 'Posttion']
            await logModel.create(logData)

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
            // log
            const data = await PositionModel.getPositionById(p_id)
            const logData = [`คุณ${req.user.username} ID: ${req.user.code} ลบข้อมูลตำแหน่ง ${data.p_name_th} เรียบร้อยแล้ว`, 'Posttion']
            await logModel.create(logData)

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

