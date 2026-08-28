const crypto = require("crypto");

const TOKEN_VERSION = "v1";

function getSecret() {
    const secret = process.env.SCAN_TOKEN_SECRET || process.env.JWT_SECRET;
    if (!secret) throw new Error("SCAN_TOKEN_SECRET or JWT_SECRET must be configured");
    return secret;
}

function signatureFor(payload) {
    return crypto
        .createHmac("sha256", getSecret())
        .update(`${TOKEN_VERSION}.${payload}`)
        .digest("base64url");
}

function createScanToken(employeeCode) {
    const payload = Buffer.from(String(employeeCode), "utf8").toString("base64url");
    return `${TOKEN_VERSION}.${payload}.${signatureFor(payload)}`;
}

function verifyScanToken(token) {
    const [version, payload, signature, ...extra] = String(token).split(".");
    if (version !== TOKEN_VERSION || !payload || !signature || extra.length > 0) return null;

    const expected = Buffer.from(signatureFor(payload));
    const actual = Buffer.from(signature);
    if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) return null;

    const employeeCode = Buffer.from(payload, "base64url").toString("utf8");
    return employeeCode || null;
}

module.exports = { createScanToken, verifyScanToken };
