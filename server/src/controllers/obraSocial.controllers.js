const db = require('../db/database');
const {ObraSocial} = require('../db/associations.sequelize');
const handleHttp = require('../utils/error.handle');

const getAll = async (req, res) => {
    try {
        const result = await ObraSocial.findAll();
        res.json(result);
    } catch (error) {
        handleHttp(res, error, 500);
    }

}

const getOne = async (req, res) => {
    const id = req.params.id;


    try {
        const obraSocial = await ObraSocial.findByPk(id);
        if (!obraSocial) {
            const error = new Error('THE ITEM DOES NOT EXIST');
            handleHttp(res, error, 404);
            return;
        }

        res.json(obraSocial);
    } catch (error) {

        handleHttp(res, error, 500);
    }
}

const create = async (req, res) => {
      const obraSocial = req.body;
 
    try {
        const os = await ObraSocial.findOne({
              where: {
                  nombre : obraSocial.nombre
              }
        });
        if(obraSocial){
             const nombre = obraSocial.nombre;
             const error = new Error(`Ya existe obra social: ${nombre}`);
             handleHttp(res, error, 500);
             return;
        }
        const result = await ObraSocial.create(obraSocial);
        res.json(result);
    } catch (error) {
        handleHttp(res, error, 500);
    }
}

const edit = async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    try {
        const obraSocial = await ObraSocial.findByPk(id);
        if (!obraSocial) {
            const error = new Error('THE ITEM DOES NOT EXIST');
            handleHttp(res, error, 404);
            return;
        }

         //Valida que el nombre de la os modificada no exista
        const obraSocialModificada = await ObraSocial.findOne({
             where: {
                 nombre : body.nombre
             }
        });

        if(obraSocialModificada && obraSocial.id!==obraSocialModificada){
                const error =  new Error(`Obra social: ${obraSocialModificada.nombre} ya existe` );
                handleHttp(res, error, 500);
                return;
        }


        const result = await obraSocial.update(body);
        res.json({ message: "Update item" });
    } catch (error) {
        handleHttp(res, error, 500);
    }
}

const remove = async (req, res) => {
    const id = req.params.id;
    console.log("Entre en remove obraSocial");
    try {
        const obraSocial = await ObraSocial.findByPk(id);
        if (!obraSocial) {
            const error = new Error('THE ITEM DOES NOT EXIST');
            handleHttp(res, error, 404);
            return;
        }
        
           // Verificar si hay usuarios que tienen esta obra social
        const usuarios = await obraSocial.getPacientes();
        if (usuarios.length > 0) {
            const error =  new Error("Cannot delete obra social with associated users");
            handleHttp(res, error, 400);
            return;
        }


        const result = await obraSocial.destroy();
        res.json({ message: "Delete item" });

    } catch (error) {
          handleHttp(res, error, 500);
    }
}





module.exports = { getAll, create, getOne, edit, remove };