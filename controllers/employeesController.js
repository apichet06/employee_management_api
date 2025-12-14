const Messages = require("../config/messages");
const EmployeeModel = require("../models/employeeModel");
const jwt = require('jsonwebtoken');

class EmployeeController {

    static async login(req, res) {
        try {
            const { usercode, password } = req.body;
            const user = await EmployeeModel.findByUserLogin(usercode);
            if (!user) {
                return res.status(404).json({ status: Messages.error, message: Messages.userNotFound });
            }
            if (user.e_password !== password) {
                return res.status(400).json({ status: Messages.error, message: Messages.invalidPassword });
            }

            delete user.e_password;
            const token = jwt.sign({ userId: user.e_id, username: user.e_fullname, status: user.r_role, r_id: user.r_id }, process.env.JWT_SECRET, { expiresIn: '24h' });

            // res.cookie("token", token, {
            //     httpOnly: true,        // JS ฝั่ง client อ่านไม่ได้ (ปลอดภัย)
            //     secure: false,         // ถ้าเป็น https ตั้งเป็น true
            //     sameSite: "lax",
            //     path: "/",
            //     maxAge: 24 * 60 * 60 * 1000, // 24 ชั่วโมง
            // });

            return res.status(200).json({ status: "ok", message: "เข้าสู่ระบบสำเร็จ", data: user, token });

        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }
    }


}

module.exports = EmployeeController;