const db = require("../config/db");

class EmployeeModel {

    static async findByUserLogin(usercode) {

        try {
            const [result] = await db.query(`SELECT a.*,c.w_name,d.e_fullname_en,d.e_usercode,d.e_password,b.r_role,b.r_id,
                e.d_department_en,d_department_th,f.p_name_en,f.p_name_th,d.e_image,d.e_email,d.e_id as e_id,g.wp_name_th,g.wp_id,d.d_id,d.e_status
                FROM employee_roles a
                RIGHT JOIN roles b ON a.r_id = b.r_id
                RIGHT JOIN website c ON a.w_id = c.w_id
                RIGHT JOIN employees d ON a.e_id = d.e_id
                RIGHT JOIN department e ON d.d_id = e.d_id
                RIGHT JOIN positions f ON d.p_id = f.p_id
                INNER JOIN workplace g ON g.wp_id = d.wp_id
                Where d.e_usercode = ? LIMIT 1`, [usercode])

            return result[0] || null;

        } catch (err) {
            throw err;
        }

    }

    static async getEmployeeAndResign() {
        try {
            const [result] = await db.query(`SELECT
                            a.*,
                            b.d_department_en, b.d_department_th,b.d_department_ja,
                            c.p_name_th AS emp_p_name_th,c.p_name_en AS emp_p_name_en,c.p_name_ja AS emp_p_name_ja,
                            d.wp_name_en, d.wp_name_th,d.wp_name_ja,
                            sup.e_firstname_en AS sup_firstname,
                            f.p_name_en AS sup_p_name_en,f.p_name_th AS sup_p_name_th,
                            ads.e_firstname_en AS add_name,upd.e_firstname_en AS upd_name,sup.p_id AS sup_p_id,
                            a.e_idcard,a.e_address,a.e_signature,a.e_degree
                            FROM employees a
                            JOIN department b  ON a.d_id  = b.d_id
                            JOIN positions  c  ON a.p_id  = c.p_id
                            JOIN workplace  d  ON a.wp_id = d.wp_id
                            LEFT JOIN employees sup ON sup.e_id = a.e_parent_id
                            LEFT JOIN positions f  ON f.p_id   = sup.p_id
                            LEFT JOIN employees ads ON ads.e_id = a.e_add_name
                            LEFT JOIN employees upd ON upd.e_id = a.e_upd_name
                            WHERE a.e_status != ?
                            ORDER BY a.e_id desc
                            `, [1]);
            if (result)
                return result;

        } catch (error) {
            throw error;
        }
    }


    static async getEmployeeAll() {
        try {
            const [result] = await db.query(`SELECT
                            a.*,
                            b.d_department_en, b.d_department_th,b.d_department_ja,
                            c.p_name_th AS emp_p_name_th,c.p_name_en AS emp_p_name_en,c.p_name_ja AS emp_p_name_ja,
                            d.wp_name_en, d.wp_name_th,d.wp_name_ja,
                            sup.e_firstname_en AS sup_firstname,
                            f.p_name_en AS sup_p_name_en,f.p_name_th AS sup_p_name_th,
                            ads.e_firstname_en AS add_name,upd.e_firstname_en AS upd_name,sup.p_id AS sup_p_id,
                            a.e_idcard,a.e_address,a.e_signature,a.e_degree
                            FROM employees a
                            JOIN department b  ON a.d_id  = b.d_id
                            JOIN positions  c  ON a.p_id  = c.p_id
                            JOIN workplace  d  ON a.wp_id = d.wp_id
                            LEFT JOIN employees sup ON sup.e_id = a.e_parent_id
                            LEFT JOIN positions f  ON f.p_id   = sup.p_id
                            LEFT JOIN employees ads ON ads.e_id = a.e_add_name
                            LEFT JOIN employees upd ON upd.e_id = a.e_upd_name
                            ORDER BY a.e_id desc
                            `);
            if (result)
                return result;

        } catch (error) {
            throw error;
        }
    }




    static async getEmployeeMaxId() {
        try {

            const [rows] = await db.query(`SELECT MAX(CAST(RIGHT(e_usercode, 3) AS UNSIGNED)) AS max_suffix FROM employees`);
            return rows[0]?.max_suffix ?? null;
        } catch (error) {
            throw error;
        }
    }

    static async buildEmployeePrefix(e_work_start_date) {
        const date = new Date(e_work_start_date);
        const buddhistYear = date.getFullYear() + 543; // 2568
        const yy = String(buddhistYear).slice(-2);     // "68" 
        const mm = String(date.getMonth() + 1).padStart(2, "0"); // "12" 
        const max = await EmployeeModel.getEmployeeMaxId();
        const nextRunning = String(max + 1).padStart(3, "0");
        return `${yy}${mm}${nextRunning}`; // "6812"
    }

    static async create(reqData) {
        try {

            const [result] = await db.query(`INSERT INTO employees  
                ( e_usercode,e_password,e_title_en,e_title_th,e_firstname_en,e_lastname_en,e_fullname_en,
                e_firstname_th,e_lastname_th,e_fullname_th,e_firstname_ja,e_lastname_ja,
                e_fullname_ja,e_birthday,d_id,e_work_start_date,p_id,wp_id,e_email,e_phone,
                e_image,e_status,e_user_line_id,e_add_name,e_blood_group, e_weight,
                e_high,e_medical_condition,e_hypersensitivity,e_incise,e_parent_id,e_address,e_signature,e_degree,e_idcard,e_resign_date) 
                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?, ?, ?, ?, ?, ?)`, reqData);
            return result;

        } catch (error) {
            throw error;
        }
    }

    static async update(reqData) {
        try {

            const [result] = await db.query(`UPDATE employees SET e_title_en = ?,e_title_th = ?,
                    e_firstname_en = ?, e_lastname_en = ?, e_fullname_en = ?, 
                    e_firstname_th = ?, e_lastname_th = ?, e_fullname_th = ?,
                    e_firstname_ja = ?, e_lastname_ja = ?, e_fullname_ja = ?,
                    e_birthday = ?, d_id = ?, e_work_start_date = ?, p_id = ?, wp_id = ?,
                    e_email = ?, e_phone = ?, e_image = ?, e_status = ?, e_user_line_id = ?,
                    e_upd_datetime = ?, e_upd_name = ?, e_blood_group = ?, e_weight = ?, e_high = ?,
                    e_medical_condition = ?, e_hypersensitivity = ?, e_incise = ?,
                    e_parent_id = ?, e_address = ?, e_signature = ?, e_degree = ?, e_idcard = ? ,e_resign_date = ?
                   WHERE e_id = ?`, reqData);
            return result;

        } catch (error) {
            throw error;
        }

    }

    static async ResetPassword(reqData) {
        try {

            const [result] = await db.query(`Update employees set e_password = ? ,e_date_pwd_change = ? where e_id = ?`, reqData);
            return result;

        } catch (error) {
            throw error;
        }
    }

    static async delete(reqData) {
        try {

            const [result] = await db.query(`DELETE FROM employees WHERE e_id = ?`, reqData
            );
            return result;

        } catch (error) {
            throw error;
        }
    }

    static async getAccountByemp(emp) {
        try {
            const [result] = await db.query(`SELECT
                            a.*,
                            b.d_department_en, b.d_department_th,b.d_department_ja,
                            c.p_name_th AS emp_p_name_th,c.p_name_en AS emp_p_name_en,c.p_name_ja AS emp_p_name_ja,
                            d.wp_name_en, d.wp_name_th,d.wp_name_ja,
                            sup.e_firstname_en AS sup_firstname,
                            f.p_name_en AS sup_p_name_en,f.p_name_th AS sup_p_name_th,
                            ads.e_firstname_en AS add_name,upd.e_firstname_en AS upd_name,sup.p_id AS sup_p_id,
                            a.e_idcard,a.e_address,a.e_signature,a.e_degree
                            FROM employees a
                            JOIN department b  ON a.d_id  = b.d_id
                            JOIN positions  c  ON a.p_id  = c.p_id
                            JOIN workplace  d  ON a.wp_id = d.wp_id
                            LEFT JOIN employees sup ON sup.e_id = a.e_parent_id
                            LEFT JOIN positions f  ON f.p_id   = sup.p_id
                            LEFT JOIN employees ads ON ads.e_id = a.e_add_name
                            LEFT JOIN employees upd ON upd.e_id = a.e_upd_name
                            WHERE a.e_usercode = ?
                            ORDER BY a.e_id desc
                            `, [emp]);
            return result[0] || null;
        } catch (error) {
            throw error;
        }
    }

    static async getEmployeeById(id) {
        try {
            const [result] = await db.query(`SELECT * FROM employees WHERE e_id = ?`, [id]);
            return result[0] || null;
        } catch (error) {
            throw error;
        }
    }

    static async getScanEmployeeByUsercode(emp) {
        try {
            const [result] = await db.query(`SELECT
                            a.e_fullname_en,a.e_fullname_th,a.e_usercode,a.e_image,a.e_work_start_date,a.e_blood_group,
                             a.e_weight,a.e_high,a.e_medical_condition,a.e_hypersensitivity,a.e_incise,
                            b.d_department_en, b.d_department_th,b.d_department_ja,
                            c.p_name_th AS emp_p_name_th,c.p_name_en AS emp_p_name_en,c.p_name_ja AS emp_p_name_ja,
                            d.wp_name_en, d.wp_name_th,d.wp_name_ja,
                            sup.e_firstname_en AS sup_firstname,
                            f.p_name_en AS sup_p_name_en,f.p_name_th AS sup_p_name_th,
                            ads.e_firstname_en AS add_name,upd.e_firstname_en AS upd_name,sup.p_id AS sup_p_id,a.e_address
                            FROM employees a
                            JOIN department b  ON a.d_id  = b.d_id
                            JOIN positions  c  ON a.p_id  = c.p_id
                            JOIN workplace  d  ON a.wp_id = d.wp_id
                            LEFT JOIN employees sup ON sup.e_id = a.e_parent_id
                            LEFT JOIN positions f  ON f.p_id   = sup.p_id
                            LEFT JOIN employees ads ON ads.e_id = a.e_add_name
                            LEFT JOIN employees upd ON upd.e_id = a.e_upd_name
                            WHERE a.e_status != ? and a.e_usercode = ?
                            ORDER BY a.e_id desc
                            `, [1, emp]);
            return result[0] ?? null;
        } catch (error) {
            throw error;
        }
    }

}
module.exports = EmployeeModel