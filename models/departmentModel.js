const db = require('../config/db')
const messages = require('../config/messages')


class DeppartmentModel {

    static async getDepartmentAll() {
        try {
            const [result] = await db.query('SELECT * FROM department');
            if (result) {
                return result;
            } else {
                throw new Error(Messages.notFound)
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = DeppartmentModel;