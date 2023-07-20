const multer = require("multer");
const { MAX_FILE_SIZE, ALLOWED_FILE_TYPE } = require("../config");

//  For Buffer Storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"), false);
  }

  if (file.size > MAX_FILE_SIZE) {
    return cb(
      new Error("File size is exceeded the limit. Max file size is 2MB"),
      false
    );
  }

  if (!ALLOWED_FILE_TYPE.includes(file.mimetype)) {
    return cb(
      new Error(
        "This type of file is not allowed. Required file types are jpg, png, webp, jpeg"
      ),
      false
    );
  }

  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;
