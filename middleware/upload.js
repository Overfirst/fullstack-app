const multer = require('multer');
const moment = require('moment');

const storage = multer.diskStorage({
    destination(request, file, callback) {
        callback(null, 'uploads/');
    },

    filename(request, file, callback) {
        const date = moment().format(`DDMMYYYY-HHmmss_SSS`);
        callback(null, `${date}-${file.originalname}`);
    }
});

const fileFilter = (request, file, callback) => {
    const availableTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    callback(null, !!availableTypes.find(type => type === file.mimetype));
};

const limits = {
    fileSize: 1024 * 1024 * 5
}

module.exports = multer({ storage, fileFilter, limits });
