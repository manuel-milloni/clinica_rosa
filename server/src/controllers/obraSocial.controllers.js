const db = require('../db/database');
const ObraSocial = require('../models/obraSocial')
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
    try {
        const obraSocial = req.body;
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
        const result = await obraSocial.update(body);
        res.json({ message: "Update item" });
    } catch (error) {
        handleHttp(res, error, 500);
    }
}

const remove = async (req, res) => {
    const id = req.params.id;
    try {
        const obraSocial = await ObraSocial.findByPk(id);
        if (!obraSocial) {
            handleHttp(res, error, 404);
            return;
        }
        const result = await obraSocial.destroy();
        res.json({ message: "Delete item" });

    } catch (error) {

    }
}





module.exports = { getAll, create, getOne, edit, remove };