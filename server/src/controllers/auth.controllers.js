const Usuario = require('../models/usuario');
const {validatePass} = require('../utils/bcrypt.pass');
const jwt = require('jsonwebtoken');
const handleHttp = require('../utils/error.handle');
const config  = require('../configs/config');


const login = async (req, res)=>{
   const {email, password} = req.body;
   

   try{
    const usuario = await Usuario.findOne({
        where: {
            email : email
        }
    });

    if(!usuario){
       const error = new Error("Usuario no encontrado");
       handleHttp(res, error, 404);
       return;
    }
   
    const isPasswordValid = await validatePass( password, usuario.password );
    if(!isPasswordValid){
         const error = new Error("Usuario o contrasena incorrecta");
         handleHttp(res, error, 401);
         return;
    }

    const token = generateToken(usuario.id, usuario.rol);
    
    res.json(token);      
    
          

   } catch(error){
       handleHttp(res, error, 500);
   }
};


const generateToken = (id, rol)=>{
     const token = jwt.sign({id : id, rol : rol}, config.jwt.signature, {
          //24hs
          expiresIn: 60*60*24*7
     });
     return token;
      
}

module.exports = {login, generateToken};

