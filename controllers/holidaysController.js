
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
            let workbook = null;

            if (ext === ".xlsx" || ext === ".xls") {
                workbook = xlsx.readFile(filePath); // ไม่ต้อง cellDates ก็ได้
                const sheet = workbook.Sheets[workbook.SheetNames[0]];

                //  ได้เป็น array-of-array
                rows = xlsx.utils.sheet_to_json(sheet, {
                    header: 1,
                    range: 1,     // ข้าม header แถวแรก
                    defval: null,
                    raw: true,
                });
            } else if (ext === ".csv") {
                //   อ่าน CSV แล้วแปลงให้เป็น array-of-array เหมือนกัน
                const temp = [];
                await new Promise((resolve, reject) => {
                    fs.createReadStream(filePath)
                        .pipe(csv({ headers: false, skipLines: 1, strict: false }))
                        .on("data", (rowObj) => {
                            // rowObj จะเป็น { '0': '...', '1': '...', ... }
                            const rowArr = Object.keys(rowObj)
                                .sort((a, b) => Number(a) - Number(b))
                                .map((k) => rowObj[k]);
                            temp.push(rowArr);
                        })
                        .on("end", resolve)
                        .on("error", reject);
                });
                rows = temp;
            } else {
                return res.status(400).json({
                    status: "error",
                    message: "รองรับเฉพาะไฟล์ CSV, XLS, XLSX",
                });
            }

            const date1904 = workbook ? !!workbook.Workbook?.WBProps?.date1904 : false;

            let imported = 0;

            for (const row of rows) {
                if (!row || row.length === 0) continue;

                const holidayType = row[0];  // A
                const startRaw = row[1];     // B
                const endRaw = row[2];       // C
                const status = row[3];       // D

                // ข้ามแถวว่าง
                if (!holidayType && !startRaw && !endRaw && !status) continue;

                const start = toSqlDate(startRaw, date1904);
                const end = toSqlDate(endRaw, date1904);

                const reqData = [holidayType, status, start, end, e_id];

                // กันข้อมูลพังเบื้องต้น
                if (!holidayType || !start || !end || !status) {
                    // จะเลือก reject หรือ skip ก็ได้
                    // ที่นี่ขอ skip แบบแจ้ง log
                    console.log("skip row (invalid):", row);
                    continue;
                }
                // console.log(reqData);
                await HolidayModel.create(reqData);
                imported++;
            }

            fs.unlinkSync(filePath);

            return res.status(200).json({
                status: Messages.ok,
                message: `Import สำเร็จ ${imported} รายการ`,
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ status: Messages.error500, message: err.message });
        }
    }

    // static async importHoliday(req, res) {
    //     try {
    //         if (!req.file) {
    //             return res.status(400).json({ status: "error", message: "กรุณาอัปโหลดไฟล์" });
    //         }

    //         const filePath = req.file.path;
    //         const ext = path.extname(req.file.originalname).toLowerCase();
    //         const e_id = req.user?.userId;

    //         let rows = [];
    //         let workbook = null; //  ประกาศไว้ก่อน

    //         if (ext === ".csv") {
    //             const csvParser = csv({
    //                 mapHeaders: ({ header }) =>
    //                     header?.replace(/^\uFEFF/, "").trim(),
    //             });

    //             await new Promise((resolve, reject) => {
    //                 fs.createReadStream(filePath)
    //                     .pipe(csvParser)
    //                     .on("data", (row) => rows.push(row))
    //                     .on("end", resolve)
    //                     .on("error", reject);
    //             });
    //         }

    //         else if (ext === ".xlsx" || ext === ".xls") {
    //             workbook = xlsx.readFile(filePath); // ❗ ไม่ใช้ cellDates
    //             const sheet = workbook.Sheets[workbook.SheetNames[0]];

    //             rows = xlsx.utils.sheet_to_json(sheet, {
    //                 defval: null,
    //                 raw: true, // ได้ excel serial number
    //             });
    //         }

    //         else {
    //             return res.status(400).json({
    //                 status: "error",
    //                 message: "รองรับเฉพาะไฟล์ CSV, XLS, XLSX",
    //             });
    //         }

    //         //  ใช้ได้เฉพาะกรณี Excel
    //         const date1904 = workbook
    //             ? !!workbook.Workbook?.WBProps?.date1904
    //             : false;

    //         for (const row of rows) {

    //             const start =
    //                 typeof row.h_start_date === "number"
    //                     ? excelSerialToSqlDate(row.h_start_date, date1904)
    //                     : toSqlDate(row.h_start_date);

    //             const end =
    //                 typeof row.h_end_date === "number"
    //                     ? excelSerialToSqlDate(row.h_end_date, date1904)
    //                     : toSqlDate(row.h_end_date);

    //             const reqData = [
    //                 row.h_name,
    //                 row.h_holiday_status,
    //                 start,
    //                 end,
    //                 e_id,
    //             ];

    //             console.log(reqData);
    //             await HolidayModel.create(reqData);
    //         }

    //         fs.unlinkSync(filePath);

    //         return res.status(200).json({
    //             status: Messages.ok,
    //             message: `Import สำเร็จ ${rows.length} รายการ`,
    //         });

    //     } catch (err) {
    //         console.error(err);
    //         return res.status(500).json({ status: Messages.error500, message: err.message });
    //     }
    // }



}

module.exports = HolidayController;