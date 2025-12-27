const db = require('../config/db')


class WebsiteModel {

    static async getWebsiteAll() {
        try {
            const [result] = await db.query(`SELECT a.*,b.e_firstname_en FROM website a
                left join employees b on a.e_id = b.e_id
                order by w_id desc`);
            if (result)
                return result;
        } catch (error) {
            throw error;
        }
    }

    static async create(reqData) {
        try {
            const [result] = await db.query(
                `INSERT INTO website (w_name,w_url,w_status,w_image,e_id) VALUES (?,?,?,?,?)`,
                reqData
            );
            return result;

        } catch (error) {
            throw error;
        }
    }

    static async update(reqData) {
        try {

            const [result] = await db.query(`UPDATE website SET w_name = ?, w_url = ?, w_status = ?,e_id = ?, w_image = ? WHERE w_id = ?`, reqData
            );
            return result;

        } catch (error) {
            throw error;
        }
    }

    static async delete(reqData) {
        try {

            const [result] = await db.query(`DELETE FROM website WHERE w_id = ?`, reqData
            );
            return result;

        } catch (error) {
            throw error;
        }
    }

    static async getById(id) {
        try {
            const [result] = await db.query(`SELECT * FROM website WHERE w_id = ?`, [id]);
            return result[0] || null;
        } catch (error) {
            throw error;
        }
    }


    static async FindByWname(name) {
        const [rows] = await db.query('SELECT w_name FROM website WHERE w_name = ?', [name]);
        // console.log(rows);
        return rows[0] || null;

    }

}

module.exports = WebsiteModel;