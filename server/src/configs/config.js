const dotenv = require('dotenv');
dotenv.config();

module.exports = {
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
     }
}