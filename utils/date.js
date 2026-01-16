const xlsx = require('xlsx');



exports.excelSerialToSqlDate = function (serial, date1904 = false) {
    if (serial == null || serial === "") return null;
    if (typeof serial !== "number") return null;

    const v = xlsx.SSF.parse_date_code(serial, { date1904 });
    if (!v) return null;

    const y = v.y;
    const m = String(v.m).padStart(2, "0");
    const d = String(v.d).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

exports.toSqlDate = function (v, date1904 = false) {
    if (v == null || v === "") return null;

    // Excel serial
    if (typeof v === "number") {
        return exports.excelSerialToSqlDate(v, date1904);
    }

    // CSV: dd/mm/yyyy
    if (typeof v === "string") {
        const s = v.trim();
        const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (!m) return null;

        const dd = m[1].padStart(2, "0");
        const mm = m[2].padStart(2, "0");
        const yyyy = m[3];
        return `${yyyy}-${mm}-${dd}`;
    }

    return null;
};