const db = require("../config/db");

class logModel {

    static async list(req, res) {

        try {
            const [res] = await db.query('SELECT * FROM logs order by l_id desc')
            return res;
        } catch (error) {
            throw error;
        }

    }

}

module.exports = logModel;