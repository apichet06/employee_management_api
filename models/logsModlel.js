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

    static async create(reqData) {
        try {
            const [result] = await db.query(`INSERT INTO logs (l_details, l_features) VALUES (?, ?)`, reqData
            );
            return result;

        } catch (error) {
            throw error;
        }
    }

}

module.exports = logModel;