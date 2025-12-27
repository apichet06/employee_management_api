const db = require("../config/db");

class WorkplaceModel {

    static async generageMaxId() {
        try {
            const [result] = await db.query('SELECT MAX(wp_plant) as MaxId FROM workplace')
            const currentMaxId = result[0].MaxId || "WP00"
            const idNumber = parseInt(currentMaxId.slice(2)) + 1
            return "WP" + idNumber.toString().padStart(2, '0')
        } catch (error) {
            throw error
        }

    }

    static async getworkplaceAll() {
        try {
            const [result] = await db.query('SELECT * FROM workplace');
            if (result)
                return result;

        } catch (error) {
            throw error;
        }
    }

    static async create(reqData) {
        try {
            const NextId = await this.generageMaxId()
            reqData.push(NextId)

            const [result] = await db.query('INSERT INTO workplace (wp_name_en, wp_name_th,wp_name_ja, wp_plant) VALUES (?, ?, ?, ?)', reqData
            );
            return result;

        } catch (error) {
            throw error;
        }
    }

    static async update(reqData) {
        try {

            const [result] = await db.query(`UPDATE workplace SET wp_name_en = ?, wp_name_th = ? , wp_name_ja = ? WHERE wp_id = ?`, reqData);
            return result;

        } catch (error) {
            throw error;
        }
    }
    static async delete(reqData) {
        try {

            const [result] = await db.query(`DELETE FROM workplace WHERE wp_id = ?`, reqData
            );
            return result;

        } catch (error) {
            throw error;
        }
    }


}

module.exports = WorkplaceModel;