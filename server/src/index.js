const express = require('express');
const dotenv = require('dotenv/config');
const morgan = require('morgan');
const cors = require('cors'); 
const db = require('./db/database');

const app = express();



//Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

//Routes
app.use('/api/obraSocial',require('./routes/obraSocial.routes'));
app.use('/api/horario', require('./routes/horario.routes'));
app.use('/api/especialidad', require('./routes/especialidad.routes'));

app.listen(process.env.PORT , () => console.log("Server runing on port ", process.env.PORT));




