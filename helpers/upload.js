const multer = require('multer')

require('dotenv').config()

const UPLOAD_DIR = process.env.UPLOAD_DIR

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR)
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now().toString()}-${file.originalname}`)
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 },
  fileFilter: (req, file, cb) => {
  // The function should call `cb` with a boolean
    // to indicate if the file should be accepted

    // To reject this file pass `false`, like so:
    //   cb(null, false)

    // To accept the file pass `true`, like so:
    //   cb(null, true)

    if (!file.mimetype.includes('image')) {
      cb(null, false)
      return
    }
    cb(null, true)

    // You can always pass an error if something goes wrong:
    // cb(new Error('I don\'t have a clue!'))
  },
})

module.exports = upload
