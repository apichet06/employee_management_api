const db = require('../config/db')
const messages = require('../config/messages')


class WebsiteModel {

    static async getWebsiteAll() {
        try {
            const [result] = await db.query(`SELECT a.*,b.e_firstname FROM website a
                left join employees b on a.e_id = b.e_id
                order by w_id asc`);
            if (result) {
                return result;
            } else {
                throw new Error(Messages.notFound) + messages.error500
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = WebsiteModel;