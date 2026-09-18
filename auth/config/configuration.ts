export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    host: process.env.MONGO_URI,
  },
  CLOUDAMQP_URL: {
    host: process.env.CLOUDAMQP_URL,
  },
  jwt: {
    jwtCode: process.env.JWT_SECRET,
  },
});
