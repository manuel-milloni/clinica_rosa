const Turno = require('../models/turno');
const handleHttp = require('../utils/error.handle');

const getAll = async (req, res)=>{
     try{
       const result = await Turno.findAll();
       res.json(result);
     } catch(error){
        handleHttp(res, error, 500);
     }
};

const create = async (req, res) =>{
     const body = req.body; 
    try{
       const result = await Turno.create(body);
       res.json(result);
     } catch(error){
         handleHttp(res, error, 500);
     }
};

const remove = async (req, res)=>{
  const id = req.params.id;
  try{
   const turno = await Turno.findByPk(id);
   if(!turno){
      const error = new Error("Turno no encontrado");
      handleHttp(res, error, 404);
      return;
   }

   //Valido diferencia de 48hs para cancelar turno.
   const fechaActual = new Date();
   const fechaTurno = new Date(turno.fecha + ' ' + turno.hora);

   const difMs = fechaTurno - fechaActual;
   
   const difHoras= difMs / (1000*60*60);
   console.log("DIFERENCIA DE HORAS: ",difHoras);

   
   if(difHoras < 48){
      const error = new Error("Para cancelar un turno debe ser con 48hs de anticipacion");
      handleHttp(res, error, 400);
      return;
   }

   const result = await turno.destroy();
   res.json(result);


  }catch(error){
     handleHttp(res, error, 500);
  }
};

const edit = async (req, res)=>{
    const id= req.params.id;
    const body = req.body;
    try{
      const turno = await Turno.findByPk(id);

      if(!turno){
          const error = new Error("Turno no encontrado");
          handleHttp(res, error, 404);
          return;
      }

      const result = await turno.update(body);
      res.json(result);
    } catch(error){
         handleHttp(res, error, 500);
    }
};

const getOne =  async (req, res) => {
    const id = req.params.id;
    try{
     const turno = await Turno.findByPk(id);
     if(!turno){
         const error =  new Error("Turno no encontrado");
         handleHttp(res, error, 404);
         return;
      }

      res.json(turno);

    } catch(error){
         handleHttp(res, error, 500);
    }
};


module.exports = {getAll, create, remove, edit, getOne};