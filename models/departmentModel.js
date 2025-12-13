const db = require('../config/db')

class DeppartmentModel {

    static async getDepartmentAll() {
        try {
            const [result] = await db.query('SELECT * FROM department');
            if (result)
                return result;

        } catch (error) {
            throw error;
        }
    }
}

module.exports = DeppartmentModel;