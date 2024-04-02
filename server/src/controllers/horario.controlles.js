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

//Pensado para que el horario se cree desde Agregar Profesional, si el horario ya existe o si lo crea devuelve el id del mismo para ser asignado en el profesional
const create = async (req, res)=>{
      try{
           const body= req.body;
           
           //Valida que no existe horario igual al ingresado
           const horario = await Horario.findOne({
                where : {
                     horaDesde : body.horaDesde,
                     horaHasta : body.horaHasta,
                     lunes: body.lunes,
                     martes : body.martes,
                     miercoles : body.miercoles,
                     jueves : body.jueves,
                     viernes: body.viernes
                }
           });

           if(horario){
                res.json(horario);
                return;
           }
            //Crea nuevo horario
           const result = await Horario.create(body);
           res.json(result);
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

          //Valida que no existe horario igual al ingresado
          const horarioRepetido = await Horario.findOne({
               where : {
                    horaDesde : body.horaDesde,
                    horaHasta : body.horaHasta,
                    lunes: body.lunes,
                    martes : body.martes,
                    miercoles : body.miercoles,
                    jueves : body.jueves,
                    viernes: body.viernes
               }
          });

          if(horarioRepetido){
               const error = new Error(`Ya existe un horario con las caracteristicas ingresadas, Id: ${horarioRepetido.id}`);
               handleHttp(res, error, 500);
               return;
          }


         //Modifico horario
         const result = await horario.update(body);
         res.json(result);
 
     }catch(error){
        handleHttp(res, error, 500);
     }
 };

 const remove = async(req, res) => {
      const id = req.params.id;
    try{
         //Valido que el horario exista
         const horario = await Horario.findByPk(id);
         if(!horario){
             const error = new Error("THE ITEM DOES NOT EXIST");
             handleHttp(res, error, 404);
             return;
         }

         //Valido que el horario no este asignado a Profesionales
         const profesionales = await horario.getProfesionalesHor();
         if(profesionales.length > 0){
             const error =  new Error('No es posible eliminar Horario asignado a Profesionales');
             handleHttp(res, error, 500);
             return;
         }
         //Elimino horario
         const result = await horario.destroy();
         res.json(result);

    } catch(error){
         handleHttp(res, error, 500);
    } 
}

const getProfesionalesByHorario = async (req, res) =>{
     const idHorario = req.params.id;
     try{
          const horario = await Horario.findByPk(idHorario);
          if(!horario){
               const error = new Error('Horario no encontrado');
               handleHttp(res, error, 404);
               return;
          }

          const profesionales = await horario.getProfesionalesHor();
          res.json(profesionales);
     }catch(error){
          handleHttp(res, error, 500);
     }
}

module.exports = {getAll, create, edit, remove, getOne, getProfesionalesByHorario};