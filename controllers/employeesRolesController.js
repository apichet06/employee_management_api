const Messages = require("../config/messages");
const employeeRolesModel = require("../models/employeeRolesModel");

class employeesRolesController {

    static async getRoles(req, res) {
        try {
            const roles = await employeeRolesModel.getRolesAll()
            if (roles)
                res.status(200).json({ status: "ok", data: roles })

        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }
    static async getRolesStatus(req, res) {
        try {
            const roles = await employeeRolesModel.getRolesStatus()
            if (roles)
                res.status(200).json({ status: "ok", data: roles })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }

    static async createRoles(req, res) {
        try {

            const { r_id, w_id, e_id } = req.body
            const reqData = [r_id, w_id, e_id]

            const roles = await employeeRolesModel.create(reqData)

            res.status(200).json({ status: Messages.ok, message: Messages.insertSuccess, data: roles })
        } catch (error) {
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ status: Messages.error, message: Messages.exists + req.body.w_id + ' & ' + req.body.e_id });
            }
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }

    static async updateRoles(req, res) {
        try {
            const { r_id, w_id, e_id, er_id } = req.body
            const reqData = [r_id, w_id, e_id, er_id]

            const roles = await employeeRolesModel.update(reqData)
            res.status(200).json({ status: Messages.ok, message: Messages.updateSuccess, data: roles })

        } catch (error) {

            if (error.code === "ER_DUP_ENTRY") {

                return res.status(409).json({ status: Messages.error, message: Messages.exists + req.body.w_id + ' & ' + req.body.e_id });
            }

            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }
    static async deleteRoles(req, res) {
        try {
            const { er_id } = req.params
            const reqData = [er_id]

            const roles = await employeeRolesModel.delete(reqData)
            res.status(200).json({ status: Messages.ok, message: Messages.deleteSuccess, data: roles })

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

module.exports = employeesRolesController;