class EmployeeModel {

    static async findByUserLogin(usercode) {
        try {
            const [result] = await db.query(`SELECT a.*,c.w_name,d.e_fullname,d.e_usercode,d.e_password,b.r_role  FROM employee_roles a
                inner join roles b 
                on a.r_id = b.r_id
                inner join website c 
                on a.w_id = c.w_id
                inner join employees d 
                on a.e_id = d.e_id
                Where d.e_usercode = ? LIMIT 1`, [usercode])

            return result[0] || null;

        } catch (err) {
            throw err;
        }

    }
}
module.exports = EmployeeModel