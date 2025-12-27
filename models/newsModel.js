const db = require('../config/db')


class NewsModel {

    static async getNewsAll() {
        try {
            const [result] = await db.query(`SELECT a.*,b.e_firstname_en FROM news a
                left join employees b on a.e_id = b.e_id
                order by n_datetime desc`);
            if (result)
                return result;

        } catch (error) {
            throw error;
        }
    }
    static async create(reqData) {
        try {
            const [result] = await db.query(`INSERT INTO news (n_title, n_message, e_id) VALUES (?, ?, ?)`, reqData
            );
            return result;

        } catch (error) {
            throw error;
        }
    }

    static async update(reqData) {
        try {

            const [result] = await db.query(`UPDATE news SET n_title = ?, n_message = ? WHERE n_id = ?`, reqData
            );
            return result;

        } catch (error) {
            throw error;
        }
    }

    static async delete(reqData) {
        console.log(reqData);

        try {

            const [result] = await db.query(`DELETE FROM news WHERE n_id = ?`, reqData
            );
            return result;

        } catch (error) {
            throw error;
        }
    }

    static async getNewsById(reqData) {
        try {
            const [result] = await db.query(`SELECT * FROM news WHERE n_id = ?`, reqData);
            return result;
        } catch (error) {
            throw error;
        }
    }


}
module.exports = NewsModel;