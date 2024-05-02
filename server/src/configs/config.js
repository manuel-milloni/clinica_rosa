const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const config = {
   app: {
      port: process.env.PORT
   },
   jwt: {
      signature: process.env.TOKEN_KEY
   },
   mysql: {
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
   },
   email: {
     user: process.env.EMAIL_USER,
     pass: process.env.EMAIL_PASS
   }
}

module.exports = {config};