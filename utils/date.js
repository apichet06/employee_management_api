exports.toSqlDate = function (input) {
    if (input == null || input === "") return null;

    // ✅ Excel จะได้ Date object
    if (input instanceof Date && !isNaN(input.getTime())) {
        const y = input.getFullYear();
        const m = String(input.getMonth() + 1).padStart(2, "0");
        const d = String(input.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    }

    const s = String(input).trim();

    // ✅ ถ้าเป็น yyyy-mm-dd อยู่แล้ว
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

    // ✅ dd/mm/yyyy หรือ d/m/yyyy
    const match = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (match) {
        const dd = String(match[1]).padStart(2, "0");
        const mm = String(match[2]).padStart(2, "0");
        const yyyy = match[3];
        return `${yyyy}-${mm}-${dd}`;
    }

    return null;
};
