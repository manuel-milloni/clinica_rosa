const {Usuario}  = require('../db/associations.sequelize');
const {Usuario_obra_social} = require('../db/associations.sequelize');
const handleHttp = require('../utils/error.handle');
const {cifrarPass} = require('../utils/bcrypt.pass');
const createObraSocialProfesional = require('./usuario_obra_social.controllers');


const getAllPacientes = async (req, res) => {
   try{
      const result = await Usuario.findAll({
          where: {
            rol: 0
          }
      });
      res.json(result);
   
  } catch(error){
      handleHttp(res, error, 500);   
   }

};


const getAllProfesionales = async (req, res) => {
    try{
       const result = await Usuario.findAll({
           where: {
             rol: 1
           }
       });
       res.json(result);
    
   } catch(error){
       handleHttp(res, error, 500);   
    }
 
 };

 const getAllPersonal = async (req, res) => {
    try{
       const result = await Usuario.findAll({
           where: {
             rol: 2
           }
       });
       res.json(result);
    
   } catch(error){
       handleHttp(res, error, 500);   
    }
 
 };

 const getOne = async (req, res)=>{
      const id = req.params.id;
      try{
        const usuario = await Usuario.findByPk(id);
        if(!usuario){
            const error = new Error("THE ITEM DOES NOT EXIST");
            handleHttp(res, error, 404  );
            return;
        }

        res.json(usuario);
      } catch(error){
         handleHttp(res, error, 500);
      }
 };

 const getByEmail = async (req, res)=>{
     const email = req.body.email;
     try{
       const usuario = await Usuario.findOne({
           where: {
              email : email
           }
       });
       if(!usuario){
          const error = new Error("Usuario no existe");
          handleHttp(res, error, 404);
          return;
       }
       res.json(usuario);
       
     } catch(error){
       handleHttp(res, error, 404);
     }
 };

 const remove = async (req, res) => {
   const id = req.params.id;
   try{
      const usuario = await Usuario.findByPk(id);
      if(!usuario){
          const error = new Error("THE ITEM DOES NOT EXIST");
          handleHttp(res, error, 404);
          return;
      }

      const result = await usuario.destroy();
      res.json(result);
   } catch(error){
     handleHttp(res, error, 500);
   }
 };

 const edit = async(req, res) => {
      const id = req.params.id;
      const body = req.body;
      try{
        const usuario = await Usuario.findByPk(id);
        if(!usuario){
            const error = new Error("THE ITEM DOES NOT EXIST");
            handleHttp(res, error, 404);
            return; 
        }
        const result = usuario.update(body);
        res.json(result);
        
      }catch(error){
         handleHttp(res, error, 500);
      }
 };


 const createPaciente = async (req, res) => {
    const body = req.body;
    body.rol = 0;

   
    if (body.id_obra_social === null && body.nroAfiliado === null) {
        return res.status(400).json({ error: 'Los campos id_obra_social y nroAfiliado no pueden ser nulos.' });
    }

    if(body.id_obra_social != 1 && body.nroAfiliado === null){
      return res.status(400).json({ error: 'Si la Obra Social no es Particular el nro de afiliado no puede ser nulo.' }); 
    }
   try{
    const usuario = await Usuario.findOne({
         where: {
            email : body.email
         }
    });

    if(usuario){
         const error = new Error('El mail ingresado ya se encuentra en uso');
         handleHttp(res, error, 400);
         return;
    }
        body.password = await cifrarPass(body.password);
        const result = await Usuario.create(body);
       
       
        res.json(result);  
        
    } catch (error) {
        handleHttp(res, error, 500);
    }
};

const createProfesional = async (req, res) => {
  const body = req.body;
  const usuario = {
      nombre : body.nombre,
      apellido : body.apellido,
      dni : body.dni,
      telefono : body.telefono,
      email : body.email,
      password : body.password,
      matricula : body.matricula,
      rol : 1,
      id_especialidad : body.id_especialidad,
      id_horario : body.id_horario

  }

  const obrasSociales = body.obras_sociales;
  

 
  if (body.matricula === null || body.id_especialidad === null || body.id_horario === null) {
      return res.status(400).json({ error: 'Los campos matricula, especialidad y horario no pueden ser nulos.' });
  }


  try {
      usuario.password = await cifrarPass(usuario.password);
      const result = await Usuario.create(usuario);
      obrasSociales.forEach((obraSocial) =>{
                  createObraSocialProfesional(result.id, obraSocial);
      });
        
     
  
      res.json(result);
  } catch (error) {
      handleHttp(res, error, 500);
  }
};




const createPersonal = async (req, res) =>{
    const body = req.body;
    body.rol = 2;
    try{
      const mailExistente = await Usuario.findOne({
           where: {
             email : body.email
           }
      })

      if(mailExistente){
          const error = new Error('Email ya registrado');
          handleHttp(res, error, 500);
          return;
      } 

      body.password = await cifrarPass(body.password); 
      const result = await Usuario.create(body);
      res.json(result);  
    } catch(error){
         handleHttp(res, error, 500);
    }
};

const usuarioLogueado = (req, res) =>{
    res.json("Usuario logueado ook");
};

const getObrasSociales = async (req, res)=>{
     const id = req.params.id;
     try{
         const profesional = await Usuario.findByPk(id);
         if(!profesional){
            const error = new Error('Profesional no existe');
            handleHttp(res, error, 404);
            return;
         }

         const profesional_os = await profesional.getProfesionalObraSocial();
         res.json(profesional_os);

     } catch(error){
        handleHttp(res, error, 500);
     }
}

 



 module.exports = {getAllPacientes, 
  getAllPersonal, getAllProfesionales, getOne, remove, 
  edit, createPaciente, createProfesional, createPersonal, 
  getByEmail, usuarioLogueado, getObrasSociales};


