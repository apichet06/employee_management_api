const Messages = require("../config/messages");
const EmployeeModel = require("../models/employeeModel");
const jwt = require('jsonwebtoken');
const fs = require("fs").promises;

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
            const token = jwt.sign({ userId: user.e_id, username: user.e_firstname, status: user.r_role, r_id: user.r_id }, process.env.JWT_SECRET, { expiresIn: '24h' });

            return res.status(200).json({ status: "ok", message: "เข้าสู่ระบบสำเร็จ", data: user, token });

        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }
    }

    static async getEmployee(req, res) {
        try {

            const employee = await EmployeeModel.getEmployeeAll()
            if (employee)
                res.status(200).json({ status: "ok", data: employee })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }
    }


    static async createEmployee(req, res) {
        try {
            const {
                e_title, e_title_th, e_firstname, e_lastname, e_firstname_th,
                e_lastname_th, d_id, e_work_start_date, p_id, wp_id, e_email,
                e_phone, e_image, e_status, e_user_line_id,
                e_add_name, e_blood_group, e_weight, e_high,
                e_medical_condition, e_hypersensitivity, e_incise, e_parent_id } = req.body
            const file = req.file;
            const folder = 'employee';


            const e_fullname = e_title + e_firstname + " " + e_lastname;
            const e_fullname_th = e_title_th + e_firstname_th + " " + e_lastname_th;


            const exists = await EmployeeModel.getByFullName(e_fullname);

            if (exists) {
                // ถ้ามีไฟล์แล้วอัปขึ้น temp มา ก็ค่อยลบทิ้ง
                if (file) {
                    fs.unlink(file.path);
                }
                return res.status(400).json({ status: 'error', message: Messages.exists + exists.w_name });
            }


            const reqData = [
                e_title, e_title_th, e_firstname, e_lastname, e_fullname,
                e_firstname_th, e_lastname_th, e_fullname_th, d_id,
                e_work_start_date, p_id, wp_id, e_email, e_phone, e_image,
                e_status, e_user_line_id, e_add_name, e_blood_group,
                e_weight, e_high, e_medical_condition, e_hypersensitivity,
                e_incise, e_parent_id]

            const employee = await EmployeeModel.create(reqData)
            res.status(200).json({ status: Messages.ok, message: Messages.insertSuccess, data: employee })
        } catch (error) {
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ status: Messages.error, message: Messages.exists + req.body.e_usercode });
            }

            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }

    static async updateEmployee(req, res) {
        try {
            const {
                e_id, e_title,
                e_firstname, e_lastname,
                d_id, e_work_start_date, p_id, wp_id,
                e_email, e_phone, e_image, e_status, e_user_line_id,
                e_blood_group, e_weight, e_high,
                e_medical_condition, e_hypersensitivity, e_incise,
                e_parent_id,
            } = req.body;

            const e_fullname = e_title + e_firstname + " " + e_lastname;
            const e_upd_name = req.user.userId;
            const e_upd_datetime = new Date();
            const reqData = [
                e_title,
                e_firstname,
                e_lastname,
                e_fullname,
                d_id,
                e_work_start_date,
                p_id,
                wp_id,
                e_email,
                e_phone,
                e_image,
                e_status,
                e_user_line_id,
                e_upd_datetime,
                e_upd_name,
                e_blood_group,
                e_weight,
                e_high,
                e_medical_condition,
                e_hypersensitivity,
                e_incise,
                e_parent_id,
                e_id,
            ];
            const employee = await EmployeeModel.update(reqData)
            res.status(200).json({ status: Messages.ok, message: Messages.updateSuccess, data: employee })
        } catch (error) {
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ status: Messages.error, message: Messages.exists + req.body.e_usercode });
            }
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }

    static async deleteEmployee(req, res) {
        try {
            const { e_id } = req.params
            const reqData = [e_id]
            const employee = await EmployeeModel.delete(reqData)
            res.status(200).json({ status: Messages.ok, message: Messages.deleteSuccess, data: employee })
        } catch (error) {
            if (error.code === "ER_ROW_IS_REFERENCED_2" || error.errno === 1451) {
                return res.status(409).json({
                    status: Messages.error, message: Messages.inUseCannotDelete, // "ข้อมูลนี้ถูกใช้อยู่ไม่สามารถลบได้"   
                })
            }
        }

    }


}

module.exports = EmployeeController;