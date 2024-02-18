const {Turno, Usuario} = require('../db/associations.sequelize');
const nodemailer = require('nodemailer');
const config = require('../configs/config');
const {Op, literal} = require('sequelize');


const getTurnosNotificables = async () =>{
      
     const fechaActual = new Date();

     //Fecha dia siguiente
     const fechaSiguiente = new Date(fechaActual);
     fechaSiguiente.setDate(fechaActual.getDate() + 1);
     fechaSiguiente.setHours(0,0,0,0);
   
    
     try{
        const turnos = await Turno.findAll({
             where : {
                fecha : {[Op.eq] : literal('DATE_ADD(CURDATE(), INTERVAL 1 DAY)')},
                estado : 'Pendiente'
             }
        });

        console.log('Turnos en getTurnosNotificables: ', turnos);
        return turnos;


     }catch(error){
        console.log('Error al obtener turnos');
     }


}

const generarBodyData = async (turno)=>{
       try{
           const profesional = await Usuario.findByPk(turno.id_profesional);

           const paciente = await Usuario.findByPk(turno.id_paciente);

           const data = {
            fecha : turno.fecha,
            hora : turno.hora,
            profesional : profesional.nombre + ' ' + profesional.apellido,
            paciente : paciente.nombre +' '+ paciente.apellido,
            emailPaciente : paciente.email
        };
        
        console.log('Data en generarBodyData: ', data);
        return data;


       }catch(error){
         console.log(error);
       }


}


const sendMail = (data)=>{
      const transporter = nodemailer.createTransport({
         service: 'Gmail',
         auth: {
            user: config.email.user,
            pass: config.email.pass
         }
      });

      const mailOptions = {
         from: config.email.user,
         to: data.emailPaciente,
         subject: 'Recordatorio de turno',
         text: `Estimado/a ${data.paciente} le recordamos su turno el dia ${data.fecha} a las ${data.hora} con ${data.profesional}`
      }

      transporter.sendMail(mailOptions, function(error, info){
          if(error){
             console.log(error);
          } else {
            console.log('Correo enviado: ' + info.response);
          }
      })

    
}

const runSender = async ()=>{
      const turnos = await getTurnosNotificables();

      turnos.forEach(async (turno) => {
            const data = await generarBodyData(turno);
            sendMail(data);
            
      });
}

module.exports = {runSender};

