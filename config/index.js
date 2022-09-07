const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'OceansCollection',
        format: async (req, file) => 'jpg',
        transformation: { width: 1000, height: 1000, crop: "limit" }
    }
})

module.exports = {
    cloudinary,
    storage
}
