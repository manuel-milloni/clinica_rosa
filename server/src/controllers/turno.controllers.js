const {Turno, Usuario} = require('../db/associations.sequelize');
const handleHttp = require('../utils/error.handle');
const {Op} = require('sequelize');



const getAllByProfesionalAndFecha = async (req, res)=>{
      const fechaString = req.body.fecha;
      const fecha = new Date(fechaString);
      const idProfesional = req.params.id;
      try{
         const turnos = await Turno.findAll({
             where:{
                 id_profesional : idProfesional,
                 fecha : fecha
              
             }
         });

         res.json(turnos);

      }catch(error){
           handleHttp(res, error, 500);
      }
}


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

const getPaciente = async (req, res)=>{
   
    const idTurno = req.params.id;

    try{
        const turno = await Turno.findByPk(idTurno);

        if(!turno){
             const error = new Error('Turno no encontrado');
             handleHttp(res, error, 404);
             return;

        }

      
        const paciente = await turno.getPaciente();
        console.log(paciente);
        res.json(paciente);
    }catch(error){
       handleHttp(res, error, 500);
    }

}

const getTurnosProfesionalByFecha = async (req, res)=>{
    const {fechaDesde, fechaHasta} = req.body;
    const idProfesional = req.params.id;
    try{
       const turnos = await Turno.findAll({
           where : {
             fecha : {
               [Op.between] : [fechaDesde, fechaHasta]
             },
             id_profesional : idProfesional
           }
       });
       
       console.log('Turnos: ', turnos);
       res.json(turnos);
    } catch(error){
        handleHttp(res, error, 500);
    }

}





module.exports = {getAll, create, remove, edit, getOne, getAllByProfesionalAndFecha, getPaciente, getTurnosProfesionalByFecha};