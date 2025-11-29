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
}

module.exports = DepartmentController;