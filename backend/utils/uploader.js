const multer = require("multer");
const path = require("path");

// Defining storage for the uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Creating the multer instance to accept multiple files (pictures)
const upload = multer({ storage: storage }).array("pictures", 10);

module.exports = upload;
