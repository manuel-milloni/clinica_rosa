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

    const token = jwt.sign({_id : usuario.id}, config.jwt.signature, {
          expiresIn: 60*60*24*7});;
    
    res.header('auth-token', token).json(usuario);      
    
          

   } catch(error){
       handleHttp(res, error, 500);
   }
};

module.exports = login;

