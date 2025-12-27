const db = require("../config/db");


class PositionModel {

    static async getpositionAll() {
        try {
            const [result] = await db.query('SELECT * FROM positions ORDER BY p_id desc');
            if (result)
                return result;

        } catch (error) {
            throw error;
        }
    }
    static async create(reqData) {
        try {

            const [result] = await db.query(
                'INSERT INTO `positions` (`p_name_en`, `p_name_th`, `p_name_ja`) VALUES (?, ?, ?)',
                reqData
            );

            return result;
        } catch (error) {
            throw error;
        }
    }

    static async update(reqData) {
        try {
            const [result] = await db.query(`UPDATE positions SET p_name_en = ?, p_name_th = ? , p_name_ja = ? WHERE p_id = ?`, reqData);
            return result;

        } catch (error) {
            throw error;
        }
    }

    static async delete(reqData) {
        try {

            const [result] = await db.query(`DELETE FROM positions WHERE p_id = ?`, reqData)
            return result;

        } catch (error) {
            throw error;
        }
    }

}

module.exports = PositionModel;