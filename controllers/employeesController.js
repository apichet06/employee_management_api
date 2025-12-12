const Messages = require("../config/messages");
const EmployeeModel = require("../models/employeeModel");
const jwt = require('jsonwebtoken');

class EmployeeController {

    static async login(req, res) {
        try {
            const { e_usercode, password } = req.body;


            if (!e_usercode || !password) {
                return res.status(400).json({ status: Messages.error, message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน', });
            }

            const user = await EmployeeModel.findByUserLogin(e_usercode);
            if (!user) {
                return res.status(401).json({ status: Messages.error, message: Messages.userNotFound });
            }
            if (user.e_password !== password) {
                return res.status(401).json({ status: Messages.error, message: Messages.invalidPassword });
            }

            delete user.e_password;
            const token = jwt.sign({ userId: user.e_id, username: user.e_fullname, status: user.r_role }, process.env.JWT_SECRET, { expiresIn: '24h' });
            return res.status(200).json({ status: "ok", message: "เข้าสู่ระบบสำเร็จ", data: user, token });

        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }
    }


}

module.exports = EmployeeController;