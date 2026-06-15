const Messages = require('../config/messages');
const DeppartmentModel = require('../models/departmentModel');
const FileUpload = require('../models/fileUploadModel');
const logModel = require('../models/logsModlel');
const fs = require('fs').promises;
const path = require('path');


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
            const { d_department_en, d_department_th, d_department_ja } = req.body;
            const file = req.file;
            const folder = 'department';
            let imagePath = null;

            if (file) {
                const uploadedPath = await FileUpload.uploadFile(file, `main_${Date.now()}`, folder);
                imagePath = uploadedPath.replace(/\\/g, '/');
            }

            const reqData = [d_department_en, d_department_th, d_department_ja, imagePath]


            const department = await DeppartmentModel.create(reqData)
            // log
            const logData = [`คุณ${req.user.username} ID: ${req.user.code} เพิ่มข้อมูลแผนก ${d_department_th} เรียบร้อยแล้ว`, 'Department']
            await logModel.create(logData)

            res.status(200).json({ status: Messages.ok, message: Messages.insertSuccess, data: department })
        } catch (error) {
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ status: Messages.error, message: Messages.exists + req.body.d_department_en });
            }
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }

    static async updateDepartment(req, res) {
        try {
            const { d_department_en, d_department_th, d_department_ja } = req.body
            const { d_id } = req.params
            const file = req.file;
            const folder = 'department';

            const oldDepartment = await DeppartmentModel.getDepartmentById(d_id);
            const oldImagePath = oldDepartment?.d_image || null;
            let imagePath = oldImagePath;

            if (file) {
                if (oldImagePath) {
                    const fullOldPath = path.join(process.cwd(), "public", oldImagePath);
                    try {
                        await fs.unlink(fullOldPath);
                    } catch (err) {
                        console.log("ลบรูปแผนกเก่าไม่ได้ (อาจไม่มีไฟล์):", err.message);
                    }
                }

                const uploadedPath = await FileUpload.uploadFile(file, `main_${Date.now()}`, folder);
                imagePath = uploadedPath.replace(/\\/g, '/');
            }

            const reqData = [d_department_en, d_department_th, d_department_ja, imagePath, d_id]


            const department = await DeppartmentModel.update(reqData)
            // log
            const logData = [`คุณ${req.user.username} ID: ${req.user.code} แก้ไขข้อมูลแผนกใหม่เป็น ${d_department_th} เรียบร้อยแล้ว`, 'Department']
            await logModel.create(logData)

            res.status(200).json({ status: Messages.ok, message: Messages.updateSuccess, data: department })
        } catch (error) {
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ status: Messages.error, message: Messages.exists + req.body.d_department_en });
            }
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }

    static async deleteDepartment(req, res) {
        try {
            const { d_id } = req.params
            const reqData = [d_id]

            // log
            const data = await DeppartmentModel.getDepartmentById(d_id)
            const logData = [`คุณ${req.user.username} ID: ${req.user.code} ลบข้อมูลแผนก ${data.d_department_th} เรียบร้อยแล้ว`, 'Department']
            await logModel.create(logData)

            const department = await DeppartmentModel.delete(reqData)

            const imageFile = data?.d_image;
            if (imageFile) {
                const fullPath = path.join(process.cwd(), "public", imageFile);
                try {
                    await fs.unlink(fullPath);
                } catch (err) {
                    console.log("ไม่พบไฟล์รูปแผนก / ลบไม่ได้ ข้ามได้:", err.message);
                }
            }

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
