const fs = require("fs").promises;
const Messages = require('../config/messages');
const FileUpload = require('../models/fileUploadModel');
const WebsiteModel = require('../models/websiteModel');
const path = require('path');



class WebsiteController {

    static async getWebsite(req, res) {
        try {
            const Website = await WebsiteModel.getWebsiteAll()
            if (Website)
                res.status(200).json({ status: "ok", data: Website })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }

    static async createWebsite(req, res) {
        try {
            const { w_name, w_url, w_status } = req.body;
            const e_id = req.user?.userId;
            const file = req.file;
            const folder = 'website';

            // 1) เช็คชื่อซ้ำก่อน จะได้ไม่ต้องอัปโหลดรูปทิ้ง
            const exists = await WebsiteModel.FindByWname(w_name);
            if (exists) {
                // ถ้ามีไฟล์แล้วอัปขึ้น temp มา ก็ค่อยลบทิ้ง
                if (file) {
                    fs.unlink(file.path);
                }
                return res.status(400).json({ status: 'error', message: Messages.exists + exists.w_name });
            }
            let imagePath = null;

            if (file) {
                const uploadedPath = await FileUpload.uploadFile(file, `main_${Date.now()}`, folder);
                //   แปลงเป็น '/' ให้เรียบร้อยก่อนเก็บลง DB
                imagePath = uploadedPath.replace(/\\/g, '/');
            }

            const reqData = [w_name, w_url, w_status, imagePath, e_id]

            const Website = await WebsiteModel.create(reqData)

            if (Website)
                res.status(200).json({ status: Messages.ok, message: Messages.insertSuccess, dasta: Website })

        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }

    static async updateWebsite(req, res) {
        try {
            const { w_name, w_url, w_status, e_id } = req.body
            const { w_id } = req.params
            const file = req.file;
            const folder = 'website';

            const oldWebsite = await WebsiteModel.getById(w_id);
            const oldImagePath = oldWebsite?.w_image || null;
            let imagePath = oldImagePath; // default = ใช้ของเก่าไปก่อน
            if (file) {

                if (oldImagePath) {
                    const fullOldPath = path.join(process.cwd(), "public", oldImagePath)
                    try {
                        await fs.unlink(fullOldPath);
                    } catch (err) {
                        console.log("ลบรูปเก่าไม่ได้ (อาจไม่มีไฟล์):", err.message);
                    }
                }

                const uploadedPath = await FileUpload.uploadFile(file, `main_${Date.now()}`, folder);
                //   แปลงเป็น '/' ให้เรียบร้อยก่อนเก็บลง DB
                imagePath = uploadedPath.replace(/\\/g, '/');
            }
            const reqData = [w_name, w_url, w_status, e_id, imagePath, w_id]

            const Website = await WebsiteModel.update(reqData)
            if (Website)
                res.status(200).json({ status: Messages.ok, message: Messages.updateSuccess, dasta: Website })

        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }

    static async deleteWebsite(req, res) {
        try {

            const { w_id } = req.params


            const websiteImage = await WebsiteModel.getById(w_id);

            const imageFile = websiteImage?.w_image;

            if (imageFile) {
                const fullPath = path.join(process.cwd(), "public", imageFile)
                // console.log("try delete:", fullPath); 
                try {
                    await fs.unlink(fullPath);
                    console.log("ลบไฟล์รูปสำเร็จ");
                } catch (err) {
                    console.log("ไม่พบไฟล์รูป ข้ามได้:", err.message);
                }
            }

            const Website = await WebsiteModel.delete([w_id])
            if (Website)
                res.status(200).json({ status: Messages.ok, message: Messages.deleteSuccess, dasta: Website })

        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }
}
module.exports = WebsiteController;