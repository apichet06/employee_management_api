const db = require('../config/db')

class DeppartmentModel {


    static async generageMaxId() {
        try {
            const [result] = await db.query('SELECT MAX(d_code) as MaxId FROM department')
            const currentMaxId = result[0].MaxId || "DP000"
            const idNumber = parseInt(currentMaxId.slice(2)) + 1
            return "DP" + idNumber.toString().padStart(3, '0')
        } catch (error) {
            throw error
        }

    }



    static async getDepartmentAll() {
        try {
            const [result] = await db.query('SELECT * FROM department');
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

            const [result] = await db.query('INSERT INTO department (d_department, d_department_th, d_code) VALUES (?, ?, ?)', reqData
            );
            return result;

        } catch (error) {
            throw error;
        }
    }

    static async update(reqData) {
        try {

            const [result] = await db.query(`UPDATE department SET d_department=?, d_department_th=?  WHERE d_id = ?`, reqData);
            return result;

        } catch (error) {
            throw error;
        }
    }

    static async delete(reqData) {
        try {

            const [result] = await db.query(`DELETE FROM department WHERE d_id = ?`, reqData
            );
            return result;

        }
        catch (error) {
            throw error;
        }
    }


}

module.exports = DeppartmentModel;