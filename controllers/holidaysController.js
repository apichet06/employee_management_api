const Messages = require('../config/messages');
const HolidayModel = require('../models/holidaysModel');
const fs = require('fs');
const csv = require('csv-parser');
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
                return res.status(400).json({ status: 'error', message: 'กรุณาอัปโหลดไฟล์ CSV' });
            }

            const filePath = req.file.path;
            const rows = [];

            const e_id = req.user?.e_id || 1;

            fs.createReadStream(filePath)
                .pipe(csv()) // csv-parser จะ map header → field ให้
                .on('data', (row) => {
                    rows.push(row);
                })
                .on('end', async () => {
                    try {
                        for (const row of rows) {
                            // ชื่อ column ต้องตรงกับ header ใน CSV
                            const h_name = row.h_name;
                            const h_holiday_status = row.h_holiday_status;
                            const h_start_date = toSqlDate(row.h_start_date);
                            const h_end_date = toSqlDate(row.h_end_date);

                            const reqData = [
                                h_name,
                                h_holiday_status,
                                h_start_date,
                                h_end_date,
                                e_id
                            ];

                            await HolidayModel.create(reqData);
                        }

                        // ลบไฟล์ชั่วคราวทิ้ง
                        fs.unlinkSync(filePath);

                        res.status(200).json({ status: Messages.ok, message: `Import สำเร็จ ${rows.length} รายการ` });
                    } catch (err) {
                        res.status(500).json({ status: Messages.error500, message: err.message });
                    }
                });
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }


}

module.exports = HolidayController;