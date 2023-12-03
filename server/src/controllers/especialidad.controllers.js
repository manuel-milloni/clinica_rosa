const db = require('../db/database');
const handleHttp = require('../utils/error.handle');
const Especialidad = require('../models/especialidad');

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
      
      const result = await especialidad.update(body);
      res.json(result);

   }catch(error){

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
        
        const result = await especialidad.destroy();
        res.json(result);
      }catch(error){
          
      }
};

module.exports = {getAll, getOne, create, edit, remove};
