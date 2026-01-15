const Messages = require("../config/messages");
const ApproverPermissionModel = require("../models/approverPermissionModel");

class ApproverPermissionContoller {


    static async getApproverPermission(req, res) {
        try {
            const approverPermission = await ApproverPermissionModel.getApproverPermissionAll()
            if (approverPermission)
                res.status(200).json({ status: "ok", data: approverPermission })
        }
        catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }
    static async createApproverPermission(req, res) {
        try {
            const { wp_id, w_id, e_id, d_id } = req.body
            const reqData = [wp_id, w_id, e_id, d_id]

            const approverPermission = await ApproverPermissionModel.create(reqData)
            // log


            res.status(200).json({ status: Messages.ok, message: Messages.insertSuccess, data: approverPermission })
        } catch (error) {
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ status: Messages.error, message: Messages.exists + req.body.wp_id + ' & ' + req.body.w_id + ' & ' + req.body.e_id + ' & ' + req.body.d_id });
            }

            res.status(500).json({ status: Messages.error500, message: error.message });

        }
    }

    static async updateApproverPermission(req, res) {
        try {
            const { wp_id, w_id, e_id, d_id, ap_id } = req.body
            const reqData = [wp_id, w_id, e_id, d_id, ap_id]

            const approverPermission = await ApproverPermissionModel.update(reqData)
            res.status(200).json({ status: Messages.ok, message: Messages.updateSuccess, data: approverPermission })
        } catch (error) {
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ status: Messages.error, message: Messages.exists + req.body.wp_id + ' & ' + req.body.w_id + ' & ' + req.body.e_id + ' & ' + req.body.d_id });
            }
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }

    static async deleteApproverPermission(req, res) {
        try {
            const { ap_id } = req.params
            const reqData = [ap_id]

            const approverPermission = await ApproverPermissionModel.delete(reqData)
            res.status(200).json({ status: Messages.ok, message: Messages.deleteSuccess, data: approverPermission })
        } catch (error) {
            if (error.code === "ER_ROW_IS_REFERENCED_2" || error.errno === 1451) {
                return res.status(409).json({ status: Messages.error, message: Messages.inUseCannotDelete });
            }

            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }

}

module.exports = ApproverPermissionContoller;