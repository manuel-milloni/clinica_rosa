const { Sequelize } = require("sequelize");

const handleHttp = (res, error, status)=> {
          console.log(error);
          if (error instanceof Sequelize.Error){
               res.status(status).send({errror: 'Database error'});
          } else {
              res.status(status).send({error: error.message});
          }
         
};

module.exports = handleHttp;