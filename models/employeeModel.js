const db = require("../config/db");

class EmployeeModel {

    static async findByUserLogin(usercode) {

        try {
            const [result] = await db.query(`SELECT a.*,c.w_name,d.e_fullname,d.e_usercode,d.e_password,b.r_role,b.r_id,
                e.d_department,d_department_th,f.p_name,f.p_name_th,d.e_image,d.e_email
                FROM employee_roles a
                right join roles b 
                on a.r_id = b.r_id
                right join website c 
                on a.w_id = c.w_id
                right join employees d 
                on a.e_id = d.e_id
                right join department e 
                on d.d_id = e.d_id
                right join position f 
                on d.p_id = f.p_id
                Where d.e_usercode = ? LIMIT 1`, [usercode])

            return result[0] || null;

        } catch (err) {
            throw err;
        }

    }
}
module.exports = EmployeeModel