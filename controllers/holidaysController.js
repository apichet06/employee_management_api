const Messages = require('../config/messages');
const HolidayModel = require('../models/holidaysModel');
const fs = require('fs');
const csv = require('csv-parser');

const xlsx = require('xlsx');
const path = require('path');
const { toSqlDate } = require('../utils/date');




class HolidayController {

    static async getHoliday(req, res) {
        try {
            const holiday = await HolidayModel.getHolidayAll()
            if (holiday)
                res.status(200).json({ status: "ok", data: holiday })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }
    static async createHoliday(req, res) {
        try {
            const { h_name, h_holiday_status, h_start_date, h_end_date, e_id } = req.body
            const reqData = [h_name, h_holiday_status, h_start_date, h_end_date, e_id]
            const holiday = await HolidayModel.create(reqData)
            res.status(200).json({ status: Messages.ok, message: Messages.insertSuccess, holiday })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }

    static async updateHoliday(req, res) {
        try {
            const { h_name, h_holiday_status, h_start_date, h_end_date, e_id, h_id } = req.body
            const reqData = [h_name, h_holiday_status, h_start_date, h_end_date, e_id, h_id]

            const holiday = await HolidayModel.update(reqData)
            res.status(200).json({ status: Messages.ok, message: Messages.updateSuccess, holiday })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }

    static async deleteHoliday(req, res) {
        try {
            const { h_id } = req.params
            const reqData = [h_id]
            const holiday = await HolidayModel.delete(reqData)
            res.status(200).json({ status: Messages.ok, message: Messages.deleteSuccess, holiday })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }


    static async importHoliday(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ status: "error", message: "กรุณาอัปโหลดไฟล์" });
            }

            const filePath = req.file.path;
            const ext = path.extname(req.file.originalname).toLowerCase();
            const e_id = req.user?.userId;

            let rows = [];

            if (ext === ".csv") {
                const csvParser = csv({
                    mapHeaders: ({ header }) =>
                        header?.replace(/^\uFEFF/, "").trim(), // ตัด BOM + trim
                });

                await new Promise((resolve, reject) => {
                    fs.createReadStream(filePath)
                        .pipe(csvParser)
                        .on("data", (row) => rows.push(row))
                        .on("end", resolve)
                        .on("error", reject);
                });
            } else if (ext === ".xlsx" || ext === ".xls") {
                const workbook = xlsx.readFile(filePath, { cellDates: true });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];

                rows = xlsx.utils.sheet_to_json(sheet, {
                    defval: null,
                    raw: true,
                });
            } else {
                return res.status(400).json({
                    status: "error",
                    message: "รองรับเฉพาะไฟล์ CSV, XLS, XLSX",
                });
            }

            for (const row of rows) {
                const reqData = [
                    row.h_name,
                    row.h_holiday_status,
                    toSqlDate(row.h_start_date),
                    toSqlDate(row.h_end_date),
                    e_id,
                ];

                console.log(reqData);
                await HolidayModel.create(reqData);
            }

            fs.unlinkSync(filePath);

            return res.status(200).json({
                status: Messages.ok,
                message: `Import สำเร็จ ${rows.length} รายการ`,
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ status: Messages.error500, message: err.message });
        }
    }


}

module.exports = HolidayController;