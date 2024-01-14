const jwt = require('jsonwebtoken');
const config = require('../configs/config');
const handleHttp = require('./error.handle');

const verifyToken = (req, res, next) =>{
    const token = req.header('auth-token');

    try{
       
      if(!token) {
          const error = new Error("Acess denied");
          handleHttp(res, error, 401 );
          return;
      }
      
      const payload = jwt.verify(token, config.jwt.signature);

      console.log("PAYLOAD ID: ", payload._id);
      console.log(payload);

      next();


    } catch(error){
         handleHttp(res, error, 401);
    }
}

const verifyTokenFront = (req, res) =>{
  const token = req.header('auth-token');

  try{
     
    if(!token) {
        const error = new Error("Acess denied");
        handleHttp(res, error, 401 );
        return;
    }
    
    const payload = jwt.verify(token, config.jwt.signature);

    console.log("PAYLOAD ID: ", payload.id);
    console.log(payload);
    res.json(payload);

   


  } catch(error){
       handleHttp(res, error, 401);
  }
}



module.exports = {verifyToken, verifyTokenFront};
