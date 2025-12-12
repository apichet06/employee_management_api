const fs = require('fs');
const path = require('path');


class FileUplood {
    static async uploadFile(file, keys, folder) {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const folderPath = `uploads/${folder}/${year}${month}`;
        const modifiedFileName = `${keys}${path.extname(file.originalname)}`;
        const filePath = path.join(folderPath, modifiedFileName);
        fs.mkdirSync(folderPath, { recursive: true });
        fs.renameSync(file.path, filePath);

        return filePath;
    }
}

module.exports = FileUplood;