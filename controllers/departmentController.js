const Messages = require('../config/messages');
const DeppartmentModel = require('../models/departmentModel');


class DepartmentController {

    static async getDepartment(req, res) {
        try {
            const department = await DeppartmentModel.getDepartmentAll()
            if (department)
                res.status(200).json({ status: "ok", data: department })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }
    static async createDepartment(req, res) {
        try {
            const { d_department, d_department_th, d_department_jp } = req.body;
            const reqData = [d_department, d_department_th, d_department_jp]

            const department = await DeppartmentModel.create(reqData)
            res.status(200).json({ status: Messages.ok, message: Messages.insertSuccess, data: department })
        } catch (error) {
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ status: Messages.error, message: Messages.exists + req.body.d_department });
            }
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }

    static async updateDepartment(req, res) {
        try {
            const { d_department, d_department_th, d_department_jp, d_id } = req.body

            const reqData = [d_department, d_department_th, d_department_jp, d_id]

            const department = await DeppartmentModel.update(reqData)

            res.status(200).json({ status: Messages.ok, message: Messages.updateSuccess, data: department })
        } catch (error) {
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ status: Messages.error, message: Messages.exists + req.body.d_department });
            }
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }

    static async deleteDepartment(req, res) {
        try {
            const { d_id } = req.params
            const reqData = [d_id]
            const department = await DeppartmentModel.delete(reqData)
            res.status(200).json({ status: Messages.ok, message: Messages.deleteSuccess, data: department })
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

module.exports = DepartmentController;