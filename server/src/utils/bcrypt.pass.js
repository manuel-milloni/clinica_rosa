const bcrypt = require('bcryptjs');

const cifrarPass = async (password)=>{
     const saltRounds = 10;
     const hashedPass = await bcrypt.hash(password, saltRounds);    
    return hashedPass;
};

const validatePass = async (password_1, passwordEncriptada)=>{
    return await bcrypt.compare(password_1, passwordEncriptada);
};

module.exports = {cifrarPass, validatePass};