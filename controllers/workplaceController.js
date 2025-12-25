const Messages = require("../config/messages");
const WorkplaceModel = require("../models/workplaceModel");

class WorkplaceController {

    static async getWorkplace(req, res) {
        try {
            const workplace = await WorkplaceModel.getworkplaceAll()
            if (workplace)
                res.status(200).json({ status: "ok", data: workplace })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }

    static async createWorkplace(req, res) {
        try {
            const { wp_name, wp_name_th, wp_name_jp } = req.body
            const reqData = [wp_name, wp_name_th, wp_name_jp]

            const workplace = await WorkplaceModel.create(reqData)
            res.status(200).json({ status: Messages.ok, message: Messages.insertSuccess, data: workplace })
        } catch (error) {
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ status: Messages.error, message: Messages.exists + req.body.wp_name });
            }
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }

    static async updateWorkplace(req, res) {
        try {
            const { wp_name, wp_name_th, wp_name_jp, wp_id } = req.body
            const reqData = [wp_name, wp_name_th, wp_name_jp, wp_id]

            console.log(reqData);

            const workplace = await WorkplaceModel.update(reqData)
            res.status(200).json({ status: Messages.ok, message: Messages.updateSuccess, data: workplace })
        } catch (error) {
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ status: Messages.error, message: Messages.exists + req.body.wp_name });
            }
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }

    static async deleteWorkplace(req, res) {
        try {
            const { wp_id } = req.params
            const reqData = [wp_id]
            const workplace = await WorkplaceModel.delete(reqData)
            res.status(200).json({ status: Messages.ok, message: Messages.deleteSuccess, data: workplace })
        } catch (error) {
            if (error.code === "ER_ROW_IS_REFERENCED_2" || error.errno === 1451) {
                return res.status(409).json({
                    status: Messages.error, message: Messages.inUseCannotDelete, // "ข้อมูลนี้ถูกใช้อยู่ไม่สามารถลบได้"
                })
            }
            res.status(500).json({ status: Messages.error500, message: error.message });

        }
    }
}

module.exports = WorkplaceController;