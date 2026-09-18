export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  CLOUDAMQP_URL: process.env.CLOUDAMQP_URL,
  jwt: {
    ADMIN_JWT_SECRET: process.env.ADMIN_JWT_SECRET,
  },
});
