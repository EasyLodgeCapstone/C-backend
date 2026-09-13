export default () => ({
  port: parseInt(process.env.PORT || '8080', 10),
  database: {
    host: process.env.MONGO_URI,
  },
  jwt: {
    adminSecret: process.env.ADMIN_JWT_SECRET,
    clientSecret: process.env.CLIENT_JWT_SECRET,
  },
  cloudinary: {
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  },
});
