const db = require("../config/db");

class ApproverPermissionModel {

    static async getApproverPermissionAll() {
        try {
            const [result] = await db.query(`
                SELECT ap.ap_id, ap.wp_id, ap.w_id, ap.e_id, ap.d_id, ap.a_date,
                       e.e_fullname_en, e.e_fullname_th, e.e_fullname_ja,
                       e.e_usercode, p.p_name_en, p.p_name_th, p.p_name_ja,
                       d.d_department_en, d.d_department_th, d.d_department_ja,
                       sd.d_department_en as sub_department_en, sd.d_department_th as sub_department_th, sd.d_department_ja as sub_department_ja,
                       wp.wp_name_en, wp.wp_name_th, wp.wp_name_ja,e.e_usercode,
                       wps.wp_name_en as sub_wpname_en, wps.wp_name_th as sub_wpname_th, wps.wp_name_ja as sub_wpname_ja
                FROM approver_permissions ap
                JOIN employees e ON ap.e_id = e.e_id
                JOIN positions p ON e.p_id = p.p_id
                JOIN department d ON e.d_id = d.d_id
                JOIN workplace wp ON e.wp_id = wp.wp_id
                JOIN workplace wps ON ap.wp_id = wps.wp_id
                JOIN website w ON w.w_id = ap.w_id
                JOIN department sd ON ap.d_id = sd.d_id
                ORDER BY ap.ap_id DESC
            `);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async create(reqData) {
        try {
            const [result] = await db.query(
                'INSERT INTO approver_permissions (wp_id, w_id, e_id, d_id) VALUES (?, ?, ?, ?,)', reqData);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async update(reqData) {
        try {
            const [result] = await db.query('UPDATE approver_permissions SET wp_id = ?, w_id = ?, e_id = ?, d_id = ?  WHERE ap_id = ?', reqData);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async delete(ap_id) {
        try {
            const [result] = await db.query('DELETE FROM approver_permissions WHERE ap_id = ?', [ap_id]);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ApproverPermissionModel;