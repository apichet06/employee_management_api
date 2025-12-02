const db = require('../config/db')
const messages = require('../config/messages')


class HolidayModel {

    static async getHolidayAll() {
        try {
            const [result] = await db.query('SELECT * FROM holiday');
            if (result) {
                return result;
            } else {
                throw new Error(Messages.notFound) + messages.error500
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = HolidayModel;