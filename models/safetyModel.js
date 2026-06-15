const db = require('../config/db')

class SafetyModel {
    static async ensureTable() {
        await db.query(`
            CREATE TABLE IF NOT EXISTS safety_documents (
                s_id INT PRIMARY KEY,
                s_title VARCHAR(255) NOT NULL DEFAULT 'ข้อมูลความปลอดภัย',
                s_file_name VARCHAR(255) NOT NULL,
                s_file_path VARCHAR(500) NOT NULL,
                s_mime_type VARCHAR(100) NOT NULL,
                s_file_size INT NOT NULL DEFAULT 0,
                s_version INT NOT NULL DEFAULT 1,
                s_add_datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                s_upd_datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `)
    }

    static async getLatest() {
        await this.ensureTable()
        const [result] = await db.query('SELECT * FROM safety_documents WHERE s_id = 1')
        return result[0] || null
    }

    static async upsert(reqData) {
        await this.ensureTable()
        const [result] = await db.query(
            `INSERT INTO safety_documents
                (s_id, s_title, s_file_name, s_file_path, s_mime_type, s_file_size, s_version)
             VALUES
                (1, ?, ?, ?, ?, ?, 1)
             ON DUPLICATE KEY UPDATE
                s_title = VALUES(s_title),
                s_file_name = VALUES(s_file_name),
                s_file_path = VALUES(s_file_path),
                s_mime_type = VALUES(s_mime_type),
                s_file_size = VALUES(s_file_size),
                s_version = s_version + 1`,
            reqData
        )
        return result
    }
}

module.exports = SafetyModel
