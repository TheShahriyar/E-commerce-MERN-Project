const multer = require('multer')
const path = require('path')
const createError = require('http-errors');
const { UPLOAD_DIR, MAX_FILE_SIZE, ALLOWED_FILE_TYPE } = require('../config');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR)
  },
  filename: function (req, file, cb) {

    const extname = path.extname(file.originalname);

    cb(null, Date.now() + '-' + file.originalname.replace(extname, '' + extname))

  }
})

const fileFilter = (req, file, cb) => {
  const extname = path.extname(file.originalname);

  if(!ALLOWED_FILE_TYPE.includes(extname.substring(1))) {
    return cb(new Error("File type not allowed"), false);
  }

  cb(null, true)
}

const upload = multer({ 
  storage: storage,
  limits: {fileSize: MAX_FILE_SIZE},
  fileFilter

});

module.exports = upload;