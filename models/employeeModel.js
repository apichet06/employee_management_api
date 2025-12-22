const db = require("../config/db");

class EmployeeModel {

    static async findByUserLogin(usercode) {

        try {
            const [result] = await db.query(`SELECT a.*,c.w_name,d.e_fullname,d.e_usercode,d.e_password,b.r_role,b.r_id,
                e.d_department,d_department_th,f.p_name,f.p_name_th,d.e_image,d.e_email,d.e_id as e_id
                FROM employee_roles a
                right join roles b 
                on a.r_id = b.r_id
                right join website c 
                on a.w_id = c.w_id
                right join employees d 
                on a.e_id = d.e_id
                right join department e 
                on d.d_id = e.d_id
                right join positions f 
                on d.p_id = f.p_id
                Where d.e_usercode = ? LIMIT 1`, [usercode])

            return result[0] || null;

        } catch (err) {
            throw err;
        }

    }


    static async getEmployeeAll() {
        try {
            const [result] = await db.query(`SELECT
                            a.*,
                            b.d_department, b.d_department_th,
                            c.p_name AS emp_p_name,c.p_name_th AS emp_p_name_th,
                            d.wp_name, d.wp_name_th,
                            sup.e_firstname AS sup_firstname,
                            f.p_name AS sup_p_name,f.p_name_th AS sup_p_name_th,
                            ads.e_firstname AS add_name,upd.e_firstname AS upd_name
                            FROM employees a
                            JOIN department b  ON a.d_id  = b.d_id
                            JOIN positions  c  ON a.p_id  = c.p_id
                            JOIN workplace  d  ON a.wp_id = d.wp_id
                            LEFT JOIN employees sup ON sup.e_id = a.e_parent_id
                            LEFT JOIN positions f  ON f.p_id   = sup.p_id
                            LEFT JOIN employees ads ON ads.e_id = a.e_add_name
                            LEFT JOIN employees upd ON upd.e_id = a.e_upd_name
                            ORDER BY  a.e_id desc
                            `);
            if (result)
                return result;

        } catch (error) {
            throw error;
        }
    }

    static async buildEmployeePrefix(e_work_start_date) {
        const date = new Date(e_work_start_date);
        const buddhistYear = date.getFullYear() + 543; // 2568
        const yy = String(buddhistYear).slice(-2);     // "68"

        const mm = String(date.getMonth() + 1).padStart(2, "0"); // "12" 
        return `${yy}${mm}`; // "6812"
    }


    static async getEmployeeMaxId() {
        try {

            const [rows] = await db.query(`SELECT MAX(CAST(RIGHT(e_usercode, 3) AS UNSIGNED)) AS max_suffix FROM employees`);
            return rows[0]?.max_suffix ?? null;
        } catch (error) {
            throw error;
        }
    }

    static async create(reqData) {
        try {
            const max = await EmployeeModel.getEmployeeMaxId();
            const prefix = await EmployeeModel.buildEmployeePrefix(reqData[9]);

            const nextRunning = String(max + 1).padStart(3, "0");
            const e_usercode = `${prefix}${nextRunning}`;
            const finalReqData = [e_usercode, ...reqData];


            const [result] = await db.query(`INSERT INTO employees  
                ( e_usercode,
                e_title,
                e_title_th,
                e_firstname,
                e_lastname,
                e_fullname,
                 e_firstname_th,
                e_lastname_th,
                e_fullname_th,
                d_id,
                e_work_start_date,
                p_id,
                wp_id,
                e_email,
                e_phone,
                e_image,
                e_status,
                e_user_line_id,
                e_add_name,
                e_blood_group,
                e_weight,
                e_high,
                e_medical_condition,
                e_hypersensitivity,
                e_incise,
                e_parent_id) 
                VALUES( ?, ?,?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, finalReqData);
            return result;

        } catch (error) {
            throw error;
        }
    }

    static async update(reqData) {
        try {
            console.log(reqData);
            const [result] = await db.query(`UPDATE employees SET e_title = ?,
                    e_firstname = ?, e_lastname = ?,
                    e_fullname = ?, d_id = ?, e_work_start_date = ?, p_id = ?, wp_id = ?,
                    e_email = ?, e_phone = ?, e_image = ?, e_status = ?, e_user_line_id = ?,
                    e_upd_datetime = ?, e_upd_name = ?,
                    e_blood_group = ?, e_weight = ?, e_high = ?,
                    e_medical_condition = ?, e_hypersensitivity = ?, e_incise = ?,
                    e_parent_id = ? WHERE e_id = ?`, reqData);
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

    static async getByFullName(id) {
        try {
            const [result] = await db.query(`SELECT * FROM employees WHERE e_fullname = ?`, [id]);
            return result[0] || null;
        } catch (error) {
            throw error;
        }
    }


}
module.exports = EmployeeModel