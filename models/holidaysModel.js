const db = require('../config/db')
const messages = require('../config/messages')


class HolidayModel {

    static async getHolidayAll() {
        try {
            const [result] = await db.query('SELECT * FROM holiday order by h_start_date desc');
            if (result) {
                return result;
            } else {
                throw new Error(Messages.notFound) + messages.error500
            }
        } catch (error) {
            throw error;
        }
    }

    static async getHolidayById(id) {
        try {
            const [result] = await db.query('SELECT * FROM holiday WHERE e_id = ?', [id]);
            return result[0] || null;
        } catch (error) {
            throw error;
        }
    }

    static async create(reqData) {
        try {
            const [result] = await db.query(`INSERT INTO holiday (h_name,h_holiday_status, h_start_date, h_end_date ,e_id) VALUES (?, ?, ?, ?,?)`, reqData
            );
            return result;

        } catch (error) {
            throw error;
        }
    }

    static async update(reqData) {
        try {
            const [result] = await db.query(`UPDATE holiday SET h_name = ?,h_holiday_status = ?,h_start_date = ?, h_end_date = ?, e_id = ? WHERE h_id = ?`, reqData);
            return result;

        } catch (error) {
            throw error;
        }
    }

    static async delete(reqData) {
        try {

            const [result] = await db.query(`DELETE FROM holiday WHERE h_id = ?`, reqData);
            return result;

        } catch (error) {
            throw error;
        }

    }

}

module.exports = HolidayModel;