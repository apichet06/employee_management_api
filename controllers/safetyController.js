const path = require('path')
const fs = require('fs').promises

const Messages = require('../config/messages')
const FileUpload = require('../models/fileUploadModel')
const SafetyModel = require('../models/safetyModel')
const logModel = require('../models/logsModlel')

class SafetyController {
    static async getSafetyDocument(req, res) {
        try {
            const data = await SafetyModel.getLatest()
            res.status(200).json({ status: Messages.ok, data })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
        }
    }

    static async uploadSafetyDocument(req, res) {
        try {
            const file = req.file

            if (!file) {
                return res.status(400).json({ status: Messages.error, message: 'กรุณาเลือกไฟล์ PDF' })
            }

            const ext = path.extname(file.originalname).toLowerCase()
            if (file.mimetype !== 'application/pdf' || ext !== '.pdf') {
                await fs.unlink(file.path).catch(() => null)
                return res.status(400).json({ status: Messages.error, message: 'อัปโหลดได้เฉพาะไฟล์ PDF เท่านั้น' })
            }

            const oldDocument = await SafetyModel.getLatest()
            const uploadedPath = await FileUpload.uploadFile(file, `safety_${Date.now()}`, 'safety')
            const filePath = uploadedPath.replace(/\\/g, '/')

            await SafetyModel.upsert([
                'ข้อมูลความปลอดภัย',
                file.originalname,
                filePath,
                file.mimetype,
                file.size,
            ])

            if (oldDocument?.s_file_path) {
                const oldFilePath = path.join(process.cwd(), 'public', oldDocument.s_file_path)
                await fs.unlink(oldFilePath).catch((err) => {
                    console.log('ลบไฟล์ safety เก่าไม่ได้ (อาจไม่มีไฟล์):', err.message)
                })
            }

            await logModel.create([
                `คุณ${req.user.username} ID: ${req.user.code} อัปโหลดไฟล์ข้อมูลความปลอดภัยเรียบร้อยแล้ว`,
                'Safety',
            ])

            const data = await SafetyModel.getLatest()
            res.status(200).json({ status: Messages.ok, message: Messages.updateSuccess, data })
        } catch (error) {
            if (req.file?.path) {
                await fs.unlink(req.file.path).catch(() => null)
            }
            res.status(500).json({ status: Messages.error500, message: error.message })
        }
    }
}

module.exports = SafetyController
