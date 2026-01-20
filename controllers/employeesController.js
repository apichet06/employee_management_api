const Messages = require("../config/messages");
const EmployeeModel = require("../models/employeeModel");
const jwt = require('jsonwebtoken');
const FileUpload = require("../models/fileUploadModel");
const path = require("path");
const fs = require("fs").promises;
const bcrypt = require('bcrypt');
const logModel = require("../models/logsModlel");


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

            if (user.e_status === 1) {
                return res.status(403).json({ status: Messages.error, message: Messages.resign });
            }

            delete user.e_password;
            const token = jwt.sign({ userId: user.e_id, username: user.e_firstname_th, code: user.e_usercode, status: user.r_role, r_id: user.r_id }, process.env.JWT_SECRET, { expiresIn: '24h' });

            return res.status(200).json({ status: "ok", message: "เข้าสู่ระบบสำเร็จ", data: user, token });

        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }
    }

    static async getEmployeeAndResignAll(req, res) {
        try {

            const employees = await EmployeeModel.getEmployeeAndResign()
            const list = Array.isArray(employees) ? employees : []

            const safeEmployees = list.map((emp) => {
                if (!emp || typeof emp !== "object") return emp
                const { e_password, ...rest } = emp
                return rest
            })
            res.status(200).json({ status: "ok", data: safeEmployees })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }
    }

    static async getEmployeeAll(req, res) {
        try {

            const employees = await EmployeeModel.getEmployeeAll()
            const list = Array.isArray(employees) ? employees : []

            const safeEmployees = list.map((emp) => {
                if (!emp || typeof emp !== "object") return emp
                const { e_password, ...rest } = emp
                return rest
            })
            res.status(200).json({ status: "ok", data: safeEmployees })
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
                e_medical_condition, e_hypersensitivity, e_incise, e_parent_id, e_address, e_degree, e_idcard, e_resign_date
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

            const resignDate = e_status === "1" ? e_resign_date : null;

            const reqData = [e_usercode, hashedPassword,
                e_title_en, e_title_th, e_firstname_en, e_lastname_en, e_fullname_en,
                e_firstname_th, e_lastname_th, e_fullname_th, e_firstname_ja,
                e_lastname_ja, e_fullname_ja, e_birthday, d_id, e_work_start_date, p_id,
                wp_id, e_email, e_phone, imagePath, e_status, e_user_line_id, e_add_name,
                e_blood_group, e_weight, e_high, e_medical_condition, e_hypersensitivity,
                e_incise, e_parent_id, e_address, signaturePath, e_degree, e_idcard, resignDate]

            const employee = await EmployeeModel.create(reqData)
            // log
            const logData = [`คุณ${req.user.username} ID: ${req.user.code} เพิ่มข้อมูล คุณ ${e_firstname_th} เข้าสู่ระบบเรียบร้อยแล้ว`, 'Employee']
            await logModel.create(logData)

            res.status(200).json({ status: Messages.ok, message: Messages.insertSuccess, data: employee })
        } catch (error) {
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ status: Messages.error, message: Messages.exists + req.body.e_firstname_en });
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
                e_high, e_medical_condition, e_hypersensitivity, e_incise, e_parent_id, e_address, e_degree, e_idcard, e_resign_date
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
            const e_fullname_ja = e_firstname_ja + "・" + e_lastname_ja;
            // const hashedPassword = await bcrypt.hash(oldWebsite.e_usercode, 10);
            const e_upd_name = req.user.userId;
            const e_upd_datetime = new Date();

            const ResignDate = e_status === "1" ? e_resign_date : null;

            const reqData = [
                e_title_en, e_title_th, e_firstname_en, e_lastname_en, e_fullname_en, e_firstname_th,
                e_lastname_th, e_fullname_th, e_firstname_ja, e_lastname_ja, e_fullname_ja,
                e_birthday, d_id, e_work_start_date, p_id, wp_id, e_email, e_phone,
                imagePath, e_status, e_user_line_id, e_upd_datetime, e_upd_name, e_blood_group,
                e_weight, e_high, e_medical_condition, e_hypersensitivity, e_incise, e_parent_id,
                e_address, signaturePath, e_degree, e_idcard, ResignDate, e_id
            ];
            const employee = await EmployeeModel.update(reqData)

            // log
            const logData = [`คุณ${req.user.username} ID: ${req.user.code} แก้ไขข้อมูลของ คุณ ${e_firstname_th} เรียบร้อยแล้ว`, 'Employee']
            await logModel.create(logData)

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
            const { e_id } = req.params;
            const reqData = [e_id];

            // 1) ดึงข้อมูลก่อน เพื่อเอา path รูป + ข้อมูลทำ log
            const fileImage = await EmployeeModel.getEmployeeById(reqData);

            // 2) ลบข้อมูลใน DB ก่อน (ถ้าลบไม่สำเร็จ จะ throw ไป catch)
            const employee = await EmployeeModel.delete(reqData);

            // 3) ทำ log หลังลบสำเร็จ
            const logData = [
                `คุณ${req.user.username} ID: ${req.user.code} ลบข้อมูล คุณ ${fileImage.e_firstname_th} เรียบร้อยแล้ว`,
                "Employee",
            ];
            await logModel.create(logData);

            // 4) ลบไฟล์รูป "หลัง DB ลบสำเร็จแล้ว" (ลบไม่ได้ก็ไม่เป็นไร)
            const imageFile = fileImage?.e_image;
            if (imageFile) {
                const fullPath = path.join(process.cwd(), "public", imageFile);
                try {
                    await fs.unlink(fullPath);
                    console.log("ลบไฟล์รูปสำเร็จ");
                } catch (err) {
                    console.log("ไม่พบไฟล์รูป / ลบไม่ได้ ข้ามได้:", err.message);
                }
            }

            const signatureFile = fileImage?.e_signature;
            if (signatureFile) {
                const fullPath = path.join(process.cwd(), "public", signatureFile);
                try {
                    await fs.unlink(fullPath);
                    console.log("ลบไฟล์ลายเซ็นสำเร็จ");
                } catch (err) {
                    console.log("ไม่พบไฟล์ลายเซ็น / ลบไม่ได้ ข้ามได้:", err.message);
                }
            }

            return res.status(200).json({ status: Messages.ok, message: Messages.deleteSuccess, data: employee });
        } catch (error) {
            if (error.code === "ER_ROW_IS_REFERENCED_2" || error.errno === 1451) {
                return res.status(409).json({
                    status: Messages.error,
                    message: Messages.inUseCannotDelete,
                });
            }
            return res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }

    static async getEmployeeAccount(req, res) {
        try {
            const { emp } = req.params
            const employee = await EmployeeModel.getAccountByemp(emp)

            res.status(200).json({ status: "ok", data: employee })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
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
            const reqData = [hashedPassword, null, e_id]
            const resetPassword = await EmployeeModel.ResetPassword(reqData)
            res.status(200).json({ status: Messages.ok, message: Messages.ResetPwdSuccess, data: resetPassword })

        } catch (error) {
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ status: Messages.error, message: Messages.exists + req.body.e_usercode });
            }
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }



    static async setNewPassword(req, res) {
        try {
            const { e_id } = req.params
            const { PasswordNew, PasswordOld } = req.body;


            const employee = await EmployeeModel.getEmployeeById(e_id);
            if (!employee) {
                return res.status(404).json({ status: Messages.error, message: Messages.notFound });

            }

            const passwordMatch = await bcrypt.compare(PasswordOld, employee.e_password)
            if (!passwordMatch) {
                return res.status(403).json({ status: Messages.error, message: Messages.PasswordNotmatch })
            }

            const hashedPassword = await bcrypt.hash(PasswordNew, 10);
            const e_date_pwd_change = new Date();
            const reqData = [hashedPassword, e_date_pwd_change, e_id]
            const resetPassword = await EmployeeModel.ResetPassword(reqData)
            res.status(200).json({ status: Messages.ok, message: Messages.ResetPwdSuccess, data: resetPassword })

        } catch (error) {
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ status: Messages.error, message: Messages.exists + req.body.e_usercode });
            }
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }


    static async getScanEmployeeById(req, res) {
        try {
            const { e_usercode } = req.params


            const employee = await EmployeeModel.getScanEmployeeByUsercode(e_usercode)

            if (!employee) {
                return res.status(403).json({ status: Messages.error, message: Messages.idNotFound })
            }

            const { e_password, e_parent_id, add_name, upd_name, sup_p_id, sup_firstname, sup_p_name_en, sup_p_name_th, ...safeEmplooyee } = employee;

            res.status(200).json({ status: "ok", data: safeEmplooyee })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }
}

module.exports = EmployeeController;