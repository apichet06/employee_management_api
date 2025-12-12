class EmployeeRolesModel {

    static async employeeRolesAll() {
        try {
            const [result] = await db.query(`SELECT a.*,c.w_name,d.e_fullname,d.e_usercode,b.r_name FROM employee_roles a
                inner join roles b 
                on a.r_id = b.r_id
                inner join website c 
                on a.w_id = c.w_id
                inner join employees d 
                on a.e_id = d.e_id
                 `);
            if (result) {
                return result;
            }

        } catch (error) {
            throw error;
        }

    }
}

module.exports = EmployeeRolesModel;