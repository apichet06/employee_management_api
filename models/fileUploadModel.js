const fs = require('fs');
const path = require('path');


class FileUpload {
    static async uploadFile(file, keys, folder) {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const relativePath = `uploads/${folder}/${year}${month}`;
        const folderPath = path.join('public/', relativePath);
        const fileName = `${keys}${path.extname(file.originalname)}`;
        const filePath = path.join(folderPath, fileName);
        fs.mkdirSync(folderPath, { recursive: true });
        fs.renameSync(file.path, filePath);

        return `${relativePath}/${fileName}`;
    }
}

module.exports = FileUpload;