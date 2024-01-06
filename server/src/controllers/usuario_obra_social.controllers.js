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

const deleteObraSocialProfesional = async (id_profesional, id_obra_social)=>{
           try{
              const item = await Usuario_obra_social.findOne({
                  where : {
                      id_profesional : id_profesional,
                      id_obra_social : id_obra_social
                  }
              });

              if(!item){
                const error =  new Error('Item no encontrado');
                handleHttp(res, error, 404);
                return;  
            }

              const result = await item.destroy();
              res.json(result);
           } catch(error){
              handleHttp(res, error, 500);
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

module.exports = {createObraSocialProfesional, getAll, deleteObraSocialProfesional};