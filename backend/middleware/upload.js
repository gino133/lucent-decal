const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "lucent-glass",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
    transformation: [{ width: 2000, crop: "limit" }],
  },
});

const upload = multer({ storage, limits: { fileSize: 8 * 1024 * 1024 } });

module.exports = upload;
