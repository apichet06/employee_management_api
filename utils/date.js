exports.toSqlDate = function (dateString) {
    if (!dateString) return null;
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().split("T")[0];
};
