const Messages = require("../config/messages");
const employeeRolesModel = require("../models/employeeRolesModel");
const logModel = require("../models/logsModlel");

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
            // @ts-ignore
            const er_id = roles.insertId;
            const data = await employeeRolesModel.getRolesById(er_id)

            const logData = [`คุณ${req.user.username} ID: ${req.user.code} เพิ่มสิทธิ์เป็น ${data.r_role} ให้กับคุณ ${data.e_firstname_th} เข้าใช้งานเว็บไซต์ ${data.w_name} เรียบร้อยแล้ว`, `Employee Roles`]
            await logModel.create(logData)

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
            const data = await employeeRolesModel.getRolesById(er_id)
            const logData = [`คุณ${req.user.username} ID: ${req.user.code} แก้ไขสิทธิ์เป็น ${data.r_role} ให้กับคุณ ${data.e_firstname_th} เข้าใช้งานเว็บไซต์ ${data.w_name} เรียบร้อยแล้ว`, `Employee Roles`]
            await logModel.create(logData)


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

            //log
            const data = await employeeRolesModel.getRolesById(er_id)
            const logData = [`คุณ${req.user.username} ID: ${req.user.code} ลบสิทธิ์เป็น ${data.r_role} ของคุณ ${data.e_firstname_th} เรียบร้อยแล้ว`, `Employee Roles`]

            await logModel.create(logData)
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