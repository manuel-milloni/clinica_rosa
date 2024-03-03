CREATE DATABASE `clinica_rosa_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

CREATE TABLE `especialidad` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `horario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `horaDesde` time NOT NULL,
  `horaHasta` time NOT NULL,
  `lunes` tinyint NOT NULL,
  `martes` tinyint NOT NULL,
  `miercoles` tinyint NOT NULL,
  `jueves` tinyint NOT NULL,
  `viernes` tinyint NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `obra_social` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) NOT NULL UNIQUE,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `clinica_rosa_db`.`obra_social` (`id`, `nombre`, `descripcion`) VALUES ('1', 'Particular', '');

CREATE TABLE `usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) NOT NULL,
  `apellido` varchar(20) NOT NULL,
  `dni` varchar(10) NOT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `email` varchar(40) NOT NULL,
  `password` varchar(255) NOT NULL,
  `matricula` varchar(10) DEFAULT NULL,
  `nroAfiliado` varchar(20) DEFAULT NULL,
  `rol` int NOT NULL,
  `id_especialidad` int DEFAULT NULL,
  `id_horario` int DEFAULT NULL,
  `id_obra_social` int DEFAULT NULL,
  `genero` char(1) DEFAULT NULL,
  `fecha_nac` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `especialidad_idx` (`id_especialidad`),
  KEY `horario_idx` (`id_horario`),
  KEY `obra_social_idx` (`id_obra_social`),
  CONSTRAINT `especialidad` FOREIGN KEY (`id_especialidad`) REFERENCES `especialidad` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `horario` FOREIGN KEY (`id_horario`) REFERENCES `horario` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `obra_social` FOREIGN KEY (`id_obra_social`) REFERENCES `obra_social` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    
    INSERT INTO `clinica_rosa_db`.`usuario` (`nombre`, `apellido`, `dni`, `telefono`, `email`, `password`,`matricula`, `nroAfiliado`, `rol`, `id_especialidad`, `id_horario`, `id_obra_social`) VALUES ('Manuel', 'Milloni', '37402301', '3413761002','manuel-milloni@hotmail.com.ar', '$2a$10$0xgAHLDMWhw82l52iHHQW.LFCWQO1d2wbup4sgQPIHkvZhN8MtUam',null,null, 2, null, null, null);
    COMMIT;
    
    -- Roles:  0 paciente, 1 profesional, 2 personal
    
    CREATE TABLE `clinica_rosa_db`.`turno` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATE NOT NULL,
  `hora` TIME NOT NULL,
  `estado` VARCHAR(45) NOT NULL,
  `observaciones` LONGTEXT NULL,
  `id_profesional` INT NOT NULL,
  `id_paciente` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `profesional_idx` (`id_profesional` ASC) VISIBLE,
  INDEX `paciente_idx` (`id_paciente` ASC) VISIBLE,
  CONSTRAINT `profesional`
    FOREIGN KEY (`id_profesional`)
    REFERENCES `clinica_rosa_db`.`usuario` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `paciente`
    FOREIGN KEY (`id_paciente`)
    REFERENCES `clinica_rosa_db`.`usuario` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE);
    
    CREATE TABLE `usuario_obra_social` (
  `id_profesional` int NOT NULL,
  `id_obra_social` int NOT NULL,
  PRIMARY KEY (`id_profesional`,`id_obra_social`),
  KEY `obra_social_idx` (`id_obra_social`),
  CONSTRAINT `obra_social_pro` FOREIGN KEY (`id_obra_social`) REFERENCES `obra_social` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `profesional_os` FOREIGN KEY (`id_profesional`) REFERENCES `usuario` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Ingreso de Registros----------------------------------------------------------------------------
INSERT INTO `obra_social` (`id`,`nombre`,`descripcion`) VALUES 
(1, 'Particular', null), 
(2, 'OSDE', 'Organización de Servicios Directos Empresarios'),
(3, 'IAPOS', 'Instituto Autárquico Provincial de Obra Social'),
(4, 'OSECAC', 'Obra Social de Empleados de Comercio y Actividades Civiles'),
(5, 'Federada Salud', null),
(6, 'Sancor Salud', null),
(7, 'Swiss Medical', null);
COMMIT;

INSERT INTO `especialidad` (`id`, `nombre`, `descripcion`) VALUES
(1,	'Traumatologia',	'Especialidad médica encargada del diagnóstico, tratamiento y prevención de lesiones musculoesqueléticas.'),
(2,	'Oftalmologia',	'Rama de la medicina que se ocupa del diagnóstico, tratamiento y prevención de enfermedades y trastornos relacionados con el ojo y la visión.'),
(3,	'Dermatologia',	'Especialidad médica centrada en el diagnóstico, tratamiento y prevención de enfermedades y trastornos relacionados con la piel, cabello, uñas y mucosas.'),
(4,	'Otorrinolaringologia',	'Especialidad médica que se ocupa del diagnóstico, tratamiento y prevención de enfermedades y trastornos relacionados con el oído, la nariz, la garganta y estructuras relacionadas del cuello y la cabeza.'),
(5,	'Pediatria',	'Medicina que se enfoca en el cuidado de la salud de los niños, desde el nacimiento hasta la adolescencia.'),
(6,	'Kinesiologia',	'Disciplina médica que estudia el movimiento del cuerpo para determinar posibles trastornos mediante la manipulación de los músculos, su movimiento y respuesta, y así determinar la zona afectada y el origen del problema.');
COMMIT;

INSERT INTO `horario` VALUES
(1,	'09:00:00',		'16:00:00',	1,	0,	1,	0,	1),
(2,	'10:00:00',		'18:00:00',	1,	0,	1,	0,	1),
(3,	'10:00:00',		'16:00:00',	0,	1,	0,	1,	0),
(4,	'13:00:00',		'17:00:00',	1,	0,	0,	0,	1),
(5,	'10:00:00',		'14:00:00',	0,	0,	1,	1,	1);
COMMIT;



