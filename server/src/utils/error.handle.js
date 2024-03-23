const fs = require('fs');
const path = require('path');
const { Sequelize, UniqueConstraintError } = require("sequelize");

const handleHttp = (res, error, status) => {
    console.error(error);
    // Guardar el error en el archivo de registro
    saveErrorLog(error);
    
    if (error instanceof Sequelize.Error) {
        let errorMessage = 'Error de base de datos';
        
        // Verificar si el error es una violación de restricción única
        if (error instanceof UniqueConstraintError) {
            // Obtener el tipo de violación de restricción única
            const constraintType = error.errors[0].type;
            errorMessage = '';

            switch (constraintType) {
                case 'unique violation':
                    // Obtener el path para determinar qué campo está duplicado
                    const fieldName = error.errors[0].path;
                    switch (fieldName) {
                        case 'matricula_UNIQUE':
                            errorMessage = 'Matrícula duplicada.';
                            break;
                        case 'email':
                            errorMessage = 'Correo electrónico duplicado.';
                            break;
                        case 'dni_UNIQUE':
                            errorMessage = 'Dni duplicado.';
                            break;
                        // Agregar más casos según sea necesario para otros campos únicos
                        default:
                            errorMessage = 'Error de restricción única.';
                    }
                    break;
                default:
                    errorMessage = 'Error de restricción única.';
            }
        }
        
        res.status(status).send({ error: errorMessage });
    } else {
        res.status(status).send({ error: error.message });
    }
};

// Función para guardar el error en el archivo de registro
const saveErrorLog = (error) => {
    const logFileName = 'logError.txt';
    const logFilePath = path.join(__dirname, logFileName);
    const logMessage = `${new Date().toISOString()}: ${JSON.stringify(error, null, 2)}\n`;
    console.log('Ubicacion del log: ', logFilePath);
    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error('Error al escribir en el archivo de registro:', err);
        }
    });
};

module.exports = handleHttp;
