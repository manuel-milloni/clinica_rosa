const express = require('express');
const config = require('./configs/config');
const morgan = require('morgan');
const cors = require('cors'); 
const db = require('./db/database');
const handleHttp = require('./utils/error.handle');

const app = express();



//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

//Routes
app.use('/api/obraSocial',require('./routes/obraSocial.routes'));
app.use('/api/horario', require('./routes/horario.routes'));
app.use('/api/especialidad', require('./routes/especialidad.routes'));
app.use('/api', require('./routes/usuario.routes'));
app.use('/api/login', require('./routes/auth.routes'));
app.use('/api/turno', require('./routes/turno.routes'));
app.use((req, res) => {
    const error = new Error('endpoint not found');
    handleHttp(res, error, 404 );
});

app.listen(config.app.port , () => console.log("Server runing on port ", config.app.port));




