const {Usuario, Usuario_obra_social} = require('../db/associations.sequelize');
const handleHttp = require('../utils/error.handle');

const createObraSocialProfesional = async (id_profesional, id_obra_social)=>{
        const body = {
            id_profesional : id_profesional,
            id_obra_social : id_obra_social
        }
        try{
            const result = await Usuario_obra_social.create(body);
            return result;
        } catch(error){
              return error;
        }
       
}

const getAll = async (req, res)=>{

     try{
        //await Usuario_obra_social.sync({ alter: true });  SINCRONIZAR MODELO CON LA BASE (si no sincronizo me crea automaticamente un id inexistente)
        const result = await Usuario_obra_social.findAll();
        res.json(result);
     }catch(error){
          handleHttp(res, error, 500);
     }
}

module.exports = {createObraSocialProfesional, getAll};