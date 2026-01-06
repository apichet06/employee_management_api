const db = require("../config/db");

class RolesModel {

    static async getRolesAll() {
        try {
            const [result] = await db.query(`
                SELECT a.*,b.r_role,d.e_fullname_en,d.e_fullname_ja,d.e_fullname_th,
                    c.w_name,e.p_name_en,e.p_name_ja,e.p_name_th,
                    f.d_department_en,f.d_department_ja,f.d_department_th,d.e_usercode,g.wp_name_en,g.wp_name_ja,g.wp_name_th
                    FROM employee_roles a 
                    INNER JOIN roles b ON a.r_id = b.r_id
                    INNER JOIN website c ON a.w_id = c.w_id
                    INNER JOIN employees d ON a.e_id = d.e_id
                    INNER JOIN positions e ON d.p_id = e.p_Id
                    INNER JOIN department f ON d.d_id = f.d_id
                    INNER JOIN workplace g ON d.wp_id = g.wp_id
                    ORDER BY a.er_id DESC`);
            if (result)
                return result;

        } catch (error) {
            throw error;
        }
    }

    static async getRolesStatus() {
        try {
            const [result] = await db.query(`SELECT * FROM  roles`);
            if (result)
                return result;

        } catch (error) {
            throw error;
        }
    }

    static async create(reqData) {
        try {
            const [result] = await db.query('INSERT INTO employee_roles (r_id, w_id, e_id) VALUES ( ?, ?, ?)', reqData);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async update(reqData) {
        try {
            const [result] = await db.query('UPDATE employee_roles SET r_id = ? , w_id = ? , e_id = ? WHERE er_id = ?', reqData);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async delete(reqData) {
        try {
            const [result] = await db.query('DELETE FROM employee_roles WHERE er_id = ?', reqData);
            return result;
        } catch (error) {
            throw error;
        }
    }


}

module.exports = RolesModel;