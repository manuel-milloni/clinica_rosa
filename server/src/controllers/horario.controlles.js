const {Horario} = require('../db/associations.sequelize');
const handleHttp = require('../utils/error.handle');

const getAll = async (req, res)=> {
       try{
           const result = await  Horario.findAll();
           res.json(result);
       } catch(error){
          handleHttp(res, error, 500);
       }
};

const getOne = async (req, res) => {
       const id = req.params.id;
       try{
            const horario = await Horario.findByPk(id);
            if(!horario){
                 const error = new Error("THE ITEM DOES NOT EXIST");
                 handleHttp(res, error, 500);
                 return;
            }
            res.json(horario); 
           
       } catch(error){
          handleHttp(res, error, 500);
       }
}

const create = async (req, res)=>{
      try{
           const body= req.body;
           const result = await Horario.create(body);
           res.json({result});
      } catch(error){
               handleHttp(res, error, 500);
      }
};

const edit = async(req, res) => {
     try{
         const id = req.params.id;
         const body = req.body;
         const horario = await Horario.findByPk(id);
         if(!horario){
              const error= new Error("THE ITEM DOES NOT EXIST");
              handleHttp(res, error, 404);
              return;
         }

         const result = await horario.update(body);
         res.json(result);
 
     }catch(error){
        handleHttp(res, error, 500);
     }
 };

 const remove = async(req, res) => {
      const id = req.params.id;
    try{
         const horario = await Horario.findByPk(id);
         if(!horario){
             const error = new Error("THE ITEM DOES NOT EXIST");
             handleHttp(res, error, 404);
             return;
         }
         const result = await horario.destroy();
         res.json(result);

    } catch(error){
         handleHttp(res, error, 500);
    } 
}

module.exports = {getAll, create, edit, remove, getOne};