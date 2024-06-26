const {Turno, Usuario} = require('../db/associations.sequelize');
const handleHttp = require('../utils/error.handle');
const {Op} = require('sequelize');



//Devuelve turnos de una determinada Fecha
const getAllByProfesionalAndFecha = async (req, res)=>{
   
      const fechaString = req.body.fecha;
      const fecha = new Date(fechaString);
      const idProfesional = req.params.id;
      try{
         const turnos = await Turno.findAll({
             where:{
                 id_profesional : idProfesional,
                 fecha : fecha,
                 estado : 'Pendiente'
              
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
     body.estado = 'Pendiente'; 
    try{
       const result = await Turno.create(body);
       res.json(result);
     } catch(error){
         handleHttp(res, error, 500);
     }
};

// const cancelarTurno = async (req, res)=>{
//   const id = req.params.id;
//   try{
//    const turno = await Turno.findByPk(id);
//    if(!turno){
//       const error = new Error("Turno no encontrado");
//       handleHttp(res, error, 404);
//       return;
//    }

//    //Valido diferencia de 48hs para cancelar turno.
//    const fechaActual = new Date();
//    const fechaTurno = new Date(turno.fecha + ' ' + turno.hora);

//    const difMs = fechaTurno - fechaActual;
   
//    const difHoras= difMs / (1000*60*60);


   
//    if(difHoras < 48){
//       const error = new Error("Para cancelar un turno debe ser con 48hs de anticipacion");
//       handleHttp(res, error, 400);
//       return;
//    }
   
//    const body = {
//     estado : 'Cancelado'
//    };
//    const result = await turno.update(body);
//    res.json(result);


//   }catch(error){
//      handleHttp(res, error, 500);
//   }
// };

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
   
        res.json(paciente);
    }catch(error){
       handleHttp(res, error, 500);
    }

}

const getTurnosProfesionalByFecha = async (req, res)=>{

    const {fechaDesde, fechaHasta} = req.body;
    const fechaDesdeDate = new Date(fechaDesde);
    const fechaHastaDate = new Date(fechaHasta);
  
    const idProfesional = req.params.id;
    try{
       const turnos = await Turno.findAll({
           where : {
             fecha : {
               [Op.between] : [fechaDesdeDate, fechaHastaDate]
             },
             id_profesional : idProfesional
           }
       });
       
      
       res.json(turnos);
    } catch(error){
        handleHttp(res, error, 500);
    }

}

const getTurnosByPaciente = async (req, res) =>{

    const idPaciente = req.params.id;

    try{
       const turnos = await Turno.findAll({
        where : {
          id_paciente : idPaciente,
          estado : 'Pendiente'
        },
        order : [['fecha', 'ASC']]
       });

       res.json(turnos);
    }catch(error){
       handleHttp(res, error, 500);
    }
}

//Informes
const getTurnosByFecha = async(req, res)=> {
   
    const {fechaDesde, fechaHasta, estado} = req.body;
 
    const fechaDesdeDate = new Date(fechaDesde);
    const fechaHastaDate = new Date(fechaHasta);
  
    let turnos = [];
    try{
       
       if(estado){
        turnos = await Turno.findAll({
          where : {
            fecha : { [Op.between] : [fechaDesdeDate, fechaHastaDate]},
            estado : estado
          },
          order : [['fecha', 'ASC']]
         });
       }
       else {
        turnos = await Turno.findAll({
          where : {
            fecha : { [Op.between] : [fechaDesdeDate, fechaHastaDate]}
           
          },
          order : [['fecha', 'ASC']]
         });

       }
    
       res.json(turnos);

    }catch(error){
       handleHttp(res, error, 500);
    }
    

}

//Informes
const getTurnosByFechaAndProfesional = async(req, res)=> {
  const idProfesional = req.params.id;
  const {fechaDesde, fechaHasta, estado} = req.body;

  const fechaDesdeDate = new Date(fechaDesde);
  const fechaHastaDate = new Date(fechaHasta);

  let turnos = [];
  try{
     
     if(estado){
      turnos = await Turno.findAll({
        where : {
          fecha : { [Op.between] : [fechaDesdeDate, fechaHastaDate]},
          estado : estado,
          id_profesional : idProfesional
        }
       });


     } else {
      turnos = await Turno.findAll({
        where : {
          fecha : { [Op.between] : [fechaDesdeDate, fechaHastaDate]},
          id_profesional : idProfesional
         
        }
       });

     }
  
     res.json(turnos);

  }catch(error){
     handleHttp(res, error, 500);
  }
}

const getTurnoByPacFechaHora = async (req, res)=>{
  const idPaciente = req.params.id;
  const {fecha, hora} = req.body;
  const fechaDate = new Date(fecha);
  const horaF = hora + ':00';
  try{
     const turno = await Turno.findAll({
       where : {
         id_paciente : idPaciente,
         fecha : fechaDate,
         hora : horaF
       }
     });
   
   res.json(turno);
  }catch(error){
   handleHttp(res,error,500 );
  }
}

const getTurnosByProfesional = async (req, res)=>{
    const {fecha, estado} = req.body;
    const idProfesional = req.params.id;
    const fechaDate = new Date(fecha);
    try{
        const turnos = await Turno.findAll({
          where : {
            fecha: {[Op.gte]: fechaDate}, //Mayores o iguales
            estado : estado,
            id_profesional : idProfesional
          },
          order : [['fecha' ,'ASC']]
        });
        
        res.json(turnos);
      
    }catch(error){
        handleHttp(res, error, 500);
    }
}

const remove = async (req, res)=>{
  const id = req.params.id;
  try{
   const turno = await Turno.findByPk(id);
   if(!turno){
      const error = new Error("Turno no encontrado");
      handleHttp(res, error, 404);
      return;
   }
   const result = await turno.destroy();
   res.json(result);


  }catch(error){
     handleHttp(res, error, 500);
  }
};





module.exports = {getAll, create, edit, getOne, getAllByProfesionalAndFecha,getTurnosProfesionalByFecha, getPaciente, getTurnosByPaciente, 
  getTurnosByFecha, getTurnosByFechaAndProfesional,getTurnoByPacFechaHora, getTurnosByProfesional, remove};