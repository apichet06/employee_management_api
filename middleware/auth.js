const jwt = require('jsonwebtoken');
const Messages = require('../config/messages');
require('dotenv').config()

class Auth {
    static async authenticateToken(req, res, next) {
        const authHeader = req.headers["authorization"];

        if (!authHeader) return res.status(401).json({ status: Messages.error, message: Messages.notToken });

        const token = authHeader.split(" ")[1]; // Bearer token

        if (!token) return res.status(401).json({ status: Messages.error, message: Messages.notToken });

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({ status: Messages.error, message: Messages.expiredToken });
                }
                return res.status(403).json({ status: Messages.error, message: Messages.invalidToken });
            }
            req.user = decoded;
            // console.log("DECODED TOKEN =>", decoded);
            next();
        });
    }

    static authorizeRoles(...roles) {
        const allowedRoles = new Set(roles.map((role) => String(role).toLowerCase()));

        return (req, res, next) => {
            const role = String(req.user?.status ?? "").toLowerCase();
            if (!allowedRoles.has(role)) {
                return res.status(403).json({
                    status: Messages.error,
                    message: "คุณไม่มีสิทธิ์ดำเนินการนี้",
                });
            }
            next();
        };
    }

    static authorizeSelf(paramName = "e_id") {
        return (req, res, next) => {
            if (String(req.user?.userId) !== String(req.params[paramName])) {
                return res.status(403).json({
                    status: Messages.error,
                    message: "คุณไม่มีสิทธิ์แก้ไขข้อมูลของผู้ใช้อื่น",
                });
            }
            next();
        };
    }
}

module.exports = Auth;
