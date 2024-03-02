const db = require('../db/database');
const handleHttp = require('../utils/error.handle');
const {Especialidad, Usuario} = require('../db/associations.sequelize');
const { json } = require('sequelize');


const getAll = async (req ,res)=>{
        try{
           const result = await Especialidad.findAll();
           res.json(result);
        } catch(error){
             handleHttp(res, error, 500);
        }
};

const getOne = async (req, res)=>{
     const id = req.params.id;
     try{
        const especialidad = await Especialidad.findByPk(id);
        if(!especialidad){
             const error = new Error("THE ITEM DOES NOT EXIST");
             handleHttp(res, error, 404);
             return;
        }

        res.json(especialidad);
     }catch(error){
         handleHttp(res, error, 500);
     }
};

const edit = async (req, res)=>{
   const id = req.params.id;
   const body = req.body;
   try{
      const especialidad = await Especialidad.findByPk(id);
      if(!especialidad){
          const error =  new Error("THE ITEM DOES NOT EXIST");
          handleHttp(res, error, 404);
          return;
      }
       //Valida que la especialidad modificada no contenga un nombre ya existente
       const especialidad_2 = await Especialidad.findOne({
           where : {
              nombre: body.nombre
           }
       })
       if(especialidad_2 && especialidad_2.id!==especialidad.id){
           const error = new Error(`Especialidad: ${body.nombre} ya existe`);
           handleHttp(res, error, 500);
           return;
       } 


      const result = await especialidad.update(body);
      res.json(result);

   }catch(error){
       handleHttp(res, error, 500);
   }
};

const create = async (req, res)=>{
    const body = req.body;
    try{
       const result = await Especialidad.create(body);
       res.json(result);
    }catch(error){
       handleHttp(res, error, 500);
    }
};

const remove = async (req, res)=>{
       const id = req.params.id;
       try{
        const especialidad = await Especialidad.findByPk(id);
        if(!especialidad){
              const error = new Error("THE ITEM DOES NOT EXIST");
              handleHttp(res, error, 404);
              return;
        }

        const profesionales = await especialidad.getProfesionales();
        console.log(profesionales);
        if(profesionales.length > 0){
          
            const error = new Error('Cannot delete especialidad with associated users');
            handleHttp(res, error, 500);
            return;
        }
        
        const result = await especialidad.destroy();
        res.json(result);
      }catch(error){
          handleHttp(res, error, 500);
      }
    
};

const getEspecialidadByProfesional = async (req, res)=>{
     const idProfesional = req.params.id;
     try{
         const profesional = await Usuario.findByPk(idProfesional);

         if(!profesional){
          const error = new Error('Error al obtener profesional');
          handleHttp(res, error, 404);
          return; 
        }

        const especialidad = await Especialidad.findByPk(profesional.id_especialidad);

        if(!especialidad){
             const error = new Error('Error al obtener especilidad');
             handleHttp(res, error, 404);
             return;
        }

        res.json(especialidad);
     }catch(error){
            handleHttp(res, error, 500);
     }
}

module.exports = {getAll, getOne, create, edit, remove, getEspecialidadByProfesional};
