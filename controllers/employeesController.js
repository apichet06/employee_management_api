const Messages = require("../config/messages");
const EmployeeModel = require("../models/employeeModel");
const jwt = require('jsonwebtoken');
const FileUpload = require("../models/fileUploadModel");
const path = require("path");
const fs = require("fs").promises;
const bcrypt = require('bcrypt');

class EmployeeController {

    static async login(req, res) {
        try {
            const { usercode, password } = req.body;
            const user = await EmployeeModel.findByUserLogin(usercode);
            if (!user) {
                return res.status(404).json({ status: Messages.error, message: Messages.userNotFound });
            }

            const passwordMatch = await bcrypt.compare(password, user.e_password)
            if (!passwordMatch) {
                return res.status(400).json({ status: Messages.error, message: Messages.invalidPassword });
            }

            delete user.e_password;
            const token = jwt.sign({ userId: user.e_id, username: user.e_firstname_en, status: user.r_role, r_id: user.r_id }, process.env.JWT_SECRET, { expiresIn: '24h' });

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
                e_title_en, e_title_th, e_firstname_en, e_lastname_en, e_firstname_th,
                e_lastname_th, e_firstname_ja, e_lastname_ja, e_birthday,
                d_id, e_work_start_date, p_id, wp_id, e_email,
                e_phone, e_status, e_user_line_id, e_blood_group, e_weight, e_high,
                e_medical_condition, e_hypersensitivity, e_incise, e_parent_id, e_address, e_degree, e_idcard
            } = req.body
            const files = req.files || {};
            const imageFile = files.e_image?.[0] || null;
            const signatureFile = files.e_signature?.[0] || null;
            const folder = 'employee';
            const folder_signature = 'signature';

            const e_fullname_en = e_title_en + e_firstname_en + " " + e_lastname_en;
            const e_fullname_th = e_title_th + e_firstname_th + " " + e_lastname_th;
            const e_fullname_ja = e_firstname_ja + " " + e_lastname_ja;
            const e_add_name = req.user.userId;
            // const exists = await EmployeeModel.getByFullName(e_fullname);

            // if (exists) {
            //     // ถ้ามีไฟล์แล้วอัปขึ้น temp มา ก็ค่อยลบทิ้ง
            //     if (file) {
            //         fs.unlink(file.path);
            //     }
            //     return res.status(400).json({ status: 'error', message: Messages.exists + exists.e_fullname });
            // }



            const e_usercode = await EmployeeModel.buildEmployeePrefix(e_work_start_date);
            const hashedPassword = await bcrypt.hash(e_usercode, 10);


            let imagePath = null;
            let signaturePath = null;

            if (imageFile) {
                const uploadedPath = await FileUpload.uploadFile(imageFile, `${e_usercode}_${Date.now()}`, folder);
                //   แปลงเป็น '/' ให้เรียบร้อยก่อนเก็บลง DB
                imagePath = uploadedPath.replace(/\\/g, '/');


            }
            if (signatureFile) {
                const uploadedSignature = await FileUpload.uploadFile(signatureFile, `${e_usercode}_sign_${Date.now()}`, folder_signature);
                signaturePath = uploadedSignature.replace(/\\/g, "/");
            }
            const reqData = [e_usercode, hashedPassword,
                e_title_en, e_title_th, e_firstname_en, e_lastname_en, e_fullname_en,
                e_firstname_th, e_lastname_th, e_fullname_th, e_firstname_ja,
                e_lastname_ja, e_fullname_ja, e_birthday, d_id, e_work_start_date, p_id,
                wp_id, e_email, e_phone, imagePath, e_status, e_user_line_id, e_add_name,
                e_blood_group, e_weight, e_high, e_medical_condition, e_hypersensitivity,
                e_incise, e_parent_id, e_address, signaturePath, e_degree, e_idcard]

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
                e_id, e_title_en, e_title_th, e_firstname_en, e_lastname_en, e_firstname_th, e_lastname_th,
                e_firstname_ja, e_lastname_ja, e_birthday, d_id, e_work_start_date, p_id,
                wp_id, e_email, e_phone, e_status, e_user_line_id, e_blood_group, e_weight,
                e_high, e_medical_condition, e_hypersensitivity, e_incise, e_parent_id, e_address, e_degree, e_idcard
            } = req.body;
            const files = req.files || {};
            const imageFile = files.e_image?.[0] || null;
            const signatureFile = files.e_signature?.[0] || null;
            const folder = 'employee';
            const folder_signature = 'signature';

            const oldWebsite = await EmployeeModel.getEmployeeById(e_id);
            const oldImagePath = oldWebsite?.e_image || null;
            let imagePath = oldImagePath; // default = ใช้ของเก่าไปก่อน

            const oldImageSignature = oldWebsite?.e_signature || null;
            let signaturePath = oldImageSignature;

            if (imageFile) {

                if (oldImagePath) {
                    const fullOldPath = path.join(process.cwd(), "public", oldImagePath)
                    try {
                        await fs.unlink(fullOldPath);
                    } catch (err) {
                        console.log("ลบรูปเก่าไม่ได้ (อาจไม่มีไฟล์):", err.message);
                    }
                }

                const uploadedPath = await FileUpload.uploadFile(imageFile, `${oldWebsite.e_usercode}_${Date.now()}`, folder);
                //   แปลงเป็น '/' ให้เรียบร้อยก่อนเก็บลง DB
                imagePath = uploadedPath.replace(/\\/g, '/');
            }
            if (signatureFile) {
                if (oldImageSignature) {
                    const fullOldPath = path.join(process.cwd(), "public", oldImageSignature);
                    try {
                        await fs.unlink(fullOldPath);
                    } catch (err) {
                        console.log("ลบลายเซ็นเก่าไม่ได้ (อาจไม่มีไฟล์):", err.message);
                    }
                }
                const uploadedPath = await FileUpload.uploadFile(signatureFile, `${oldWebsite.e_usercode}_sign_${Date.now()}`, folder_signature);
                signaturePath = uploadedPath.replace(/\\/g, '/');
            }



            const e_fullname_en = e_title_en + e_firstname_en + " " + e_lastname_en;
            const e_fullname_th = e_title_th + e_firstname_th + " " + e_lastname_th;
            const e_fullname_ja = e_firstname_ja + " " + e_lastname_ja;
            // const hashedPassword = await bcrypt.hash(oldWebsite.e_usercode, 10);
            const e_upd_name = req.user.userId;
            const e_upd_datetime = new Date();
            const reqData = [
                e_title_en, e_title_th, e_firstname_en, e_lastname_en, e_fullname_en, e_firstname_th,
                e_lastname_th, e_fullname_th, e_firstname_ja, e_lastname_ja, e_fullname_ja,
                e_birthday, d_id, e_work_start_date, p_id, wp_id, e_email, e_phone,
                imagePath, e_status, e_user_line_id, e_upd_datetime, e_upd_name, e_blood_group,
                e_weight, e_high, e_medical_condition, e_hypersensitivity, e_incise, e_parent_id,
                e_address, signaturePath, e_degree, e_idcard, e_id
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

            const fileImage = await EmployeeModel.getEmployeeById(reqData);

            const imageFile = fileImage?.e_image;

            if (imageFile) {
                const fullPath = path.join(process.cwd(), "public", imageFile)
                console.log("try delete:", fullPath);
                try {
                    await fs.unlink(fullPath);
                    console.log("ลบไฟล์รูปสำเร็จ");
                } catch (err) {
                    console.log("ไม่พบไฟล์รูป ข้ามได้:", err.message);
                }
            }

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

    static async resetPassword(req, res) {
        try {
            const { e_id } = req.params

            const employee = await EmployeeModel.getEmployeeById(e_id);
            if (!employee) {
                return res.status(404).json({ status: Messages.error, message: Messages.notFound });

            }
            const hashedPassword = await bcrypt.hash(employee.e_usercode, 10);
            const reqData = [hashedPassword, e_id]
            const resetPassword = await EmployeeModel.ResetPassword(reqData)
            res.status(200).json({ status: Messages.ok, message: Messages.ResetPwdSuccess, data: resetPassword })

        } catch (error) {
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ status: Messages.error, message: Messages.exists + req.body.e_usercode });
            }
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }
}

module.exports = EmployeeController;