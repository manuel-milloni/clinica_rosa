CREATE DATABASE `clinica_rosa_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;



CREATE TABLE `clinica_rosa_db`.`especialidad` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `clinica_rosa_db`.`horario` (
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

CREATE TABLE `clinica_rosa_db`.`obra_social` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) NOT NULL UNIQUE,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `clinica_rosa_db`.`obra_social` (`id`, `nombre`, `descripcion`) VALUES ('1', 'Particular', '');

CREATE TABLE `clinica_rosa_db`.`usuario` (
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
    
    INSERT INTO `clinica_rosa_db`.`usuario` (`id`,`nombre`, `apellido`, `dni`, `telefono`, `email`, `password`,`matricula`, `nroAfiliado`, `rol`, `id_especialidad`, `id_horario`, `id_obra_social`) VALUES (1,'Manuel', 'Milloni', '37402301', '3413761002','manuel-milloni@hotmail.com.ar', '$2a$10$0xgAHLDMWhw82l52iHHQW.LFCWQO1d2wbup4sgQPIHkvZhN8MtUam',null,null, 2, null, null, null);
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
    
CREATE TABLE `clinica_rosa_db`.`usuario_obra_social` (
  `id_profesional` int NOT NULL,
  `id_obra_social` int NOT NULL,
  `id`int DEFAULT NULL ,
  PRIMARY KEY (`id_profesional`,`id_obra_social`),
  KEY `obra_social_idx` (`id_obra_social`),
  KEY `usuario_obra_social_id_foreign_idx` (`id`),
  CONSTRAINT `obra_social_pro` FOREIGN KEY (`id_obra_social`) REFERENCES `obra_social` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `profesional_os` FOREIGN KEY (`id_profesional`) REFERENCES `usuario` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `usuario_obra_social_id_foreign_idx` FOREIGN KEY (`id`) REFERENCES `usuario` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



-- Ingreso de Registros----------------------------------------------------------------------------
INSERT INTO `clinica_rosa_db`.`obra_social` (`id`,`nombre`,`descripcion`) VALUES 

(2, 'OSDE', 'Organización de Servicios Directos Empresarios'),
(3, 'IAPOS', 'Instituto Autárquico Provincial de Obra Social'),
(4, 'OSECAC', 'Obra Social de Empleados de Comercio y Actividades Civiles'),
(5, 'Federada Salud', null),
(6, 'Sancor Salud', null),
(7, 'Swiss Medical', null);
COMMIT;

INSERT INTO `clinica_rosa_db`.`especialidad` (`id`, `nombre`, `descripcion`) VALUES
(1,	'Traumatologia',	'Especialidad médica encargada del diagnóstico, tratamiento y prevención de lesiones musculoesqueléticas.'),
(2,	'Oftalmologia',	'Rama de la medicina que se ocupa del diagnóstico, tratamiento y prevención de enfermedades y trastornos relacionados con el ojo y la visión.'),
(3,	'Dermatologia',	'Especialidad médica centrada en el diagnóstico, tratamiento y prevención de enfermedades y trastornos relacionados con la piel, cabello, uñas y mucosas.'),
(4,	'Otorrinolaringologia',	'Especialidad médica que se ocupa del diagnóstico, tratamiento y prevención de enfermedades y trastornos relacionados con el oído, la nariz, la garganta y estructuras relacionadas del cuello y la cabeza.'),
(5,	'Pediatria',	'Medicina que se enfoca en el cuidado de la salud de los niños, desde el nacimiento hasta la adolescencia.'),
(6,	'Kinesiologia',	'Disciplina médica que estudia el movimiento del cuerpo para determinar posibles trastornos mediante la manipulación de los músculos, su movimiento y respuesta, y así determinar la zona afectada y el origen del problema.');
COMMIT;

INSERT INTO `clinica_rosa_db`.`horario` VALUES
(1,	'09:00:00',		'16:00:00',	1,	0,	1,	0,	1),
(2,	'10:00:00',		'18:00:00',	1,	0,	1,	0,	1),
(3,	'10:00:00',		'16:00:00',	0,	1,	0,	1,	0),
(4,	'13:00:00',		'17:00:00',	1,	0,	0,	0,	1),
(5,	'10:00:00',		'14:00:00',	0,	0,	1,	1,	1);
COMMIT;


-- Profesionales 
INSERT INTO `clinica_rosa_db`.`usuario` (`id`,`nombre`, `apellido`, `dni`, `telefono`, `email`, `password`,`matricula`, `nroAfiliado`, `rol`, `id_especialidad`, `id_horario`, `id_obra_social`, `genero`, `fecha_nac`) VALUES 
(2,	'Veronica', 'Estrella',	'30123456',	'3413678998',	'veronica@gmail.com',	'$2a$10$0xgAHLDMWhw82l52iHHQW.LFCWQO1d2wbup4sgQPIHkvZhN8MtUam',	'40301',	null,	1,	1,	1,	null,	null,	null),
(3,	'Luis',	'Fonsi',	'29812332',	'3415729922',	'luis@gmail.com',	'$2a$10$0xgAHLDMWhw82l52iHHQW.LFCWQO1d2wbup4sgQPIHkvZhN8MtUam',	'50231',	null,	1,	2,	2,	null,	null,	null),
(4,	'Giuliana',	'Lopez',	'28021233',	'3417652881',	'giuliana@gmail.com',	'$2a$10$0xgAHLDMWhw82l52iHHQW.LFCWQO1d2wbup4sgQPIHkvZhN8MtUam',	'10221',	null,	1,	3,	3,	null,	null,	null),
(5,	'Ricardo',	'Araujo',	'20673876',	'3416721003',	'ricardo@gmail.com',	'$2a$10$0xgAHLDMWhw82l52iHHQW.LFCWQO1d2wbup4sgQPIHkvZhN8MtUam',	'32222',	null,	1,	4,	4,	null,	null,	null),
(6,	'Mario',	'Malcorra',	'21022223',	'3416872993',	'mario@gmail.com',	'$2a$10$0xgAHLDMWhw82l52iHHQW.LFCWQO1d2wbup4sgQPIHkvZhN8MtUam',	'45231',	null,	1,	5,	5,	null,	null,	null),
(7,	'Maria',	'Rinaldi',	'20341221',	'3417628221',	'maria@gmail.com',	'$2a$10$0xgAHLDMWhw82l52iHHQW.LFCWQO1d2wbup4sgQPIHkvZhN8MtUam',	'20122',	null,	1,	1,	1,	null,	null,	null),
(8,	'Hector',	'Cuper',	'19021231',	'3418761121',	'hector@gmail.com',	'$2a$10$0xgAHLDMWhw82l52iHHQW.LFCWQO1d2wbup4sgQPIHkvZhN8MtUam',	'19202',	null,	1,	2,	2,	null,	null,	null),
(9,	'Claudia',	'Rica',	'21002112',	'3413876221',	'claudia@gmail.com',	'$2a$10$0xgAHLDMWhw82l52iHHQW.LFCWQO1d2wbup4sgQPIHkvZhN8MtUam',	'14221',	null,	1,	3,	3,	null,	null,	null);
COMMIT;

-- Pacientes
INSERT INTO `clinica_rosa_db`.`usuario` (`id`,`nombre`, `apellido`, `dni`, `telefono`, `email`, `password`,`matricula`, `nroAfiliado`, `rol`, `id_especialidad`, `id_horario`, `id_obra_social`, `genero`, `fecha_nac`) VALUES 
(10,	'Marcelo', 	'Salas',	'27921002',	'3413678998',	'marcelo@gmail.com',	'$2a$10$0xgAHLDMWhw82l52iHHQW.LFCWQO1d2wbup4sgQPIHkvZhN8MtUam',	null,	'30212',	0,	null,	null,	2,	'M',	'1990-05-23'),
(11,	'Lisa',	'Lauro',	'33122020',	'3415729922',	'lisa@gmail.com',	'$2a$10$0xgAHLDMWhw82l52iHHQW.LFCWQO1d2wbup4sgQPIHkvZhN8MtUam',	null,	null,	0,	null,	null,	1,	'F',	'1985-10-17'),
(12,	'Julio',	'Grondona',	'15021221',	'3417652881',	'julio@gmail.com',	'$2a$10$0xgAHLDMWhw82l52iHHQW.LFCWQO1d2wbup4sgQPIHkvZhN8MtUam',	null,	'32102',	0,	null,	null,	3,	'M',	'1978-03-09'),
(13,	'Marisa',	'Olasca',	'19220331',	'3416721003',	'marisa@gmail.com',	'$2a$10$0xgAHLDMWhw82l52iHHQW.LFCWQO1d2wbup4sgQPIHkvZhN8MtUam',	null,	null,	0,	null,	null,	1,	'F',	'1996-08-31'),
(14,	'Adolfo',	'Ruperti',	'12332122',	'3416872993',	'adolfo@gmail.com',	'$2a$10$0xgAHLDMWhw82l52iHHQW.LFCWQO1d2wbup4sgQPIHkvZhN8MtUam',	null,	'54431',	0,	null,	null,	4,	'M',	'1982-11-14'),
(15,	'Lucas',	'Usb',	'16222321',	'3417628221',	'lucas@gmail.com',	'$2a$10$0xgAHLDMWhw82l52iHHQW.LFCWQO1d2wbup4sgQPIHkvZhN8MtUam',	null,	'69492',	0,	null,	null,	2,	'M',	'1975-07-28'),
(16,	'Miriam',	'Lupestri',	'17822311',	'3418761121',	'miriam@gmail.com',	'$2a$10$0xgAHLDMWhw82l52iHHQW.LFCWQO1d2wbup4sgQPIHkvZhN8MtUam',	null,	'34122',	0,	null,	null,	2,	'F',	'2000-01-05'),
(17,	'Ludovica',	'Arrazabal',	'14230222',	'3413876221',	'ludovica@gmail.com',	'$2a$10$0xgAHLDMWhw82l52iHHQW.LFCWQO1d2wbup4sgQPIHkvZhN8MtUam',	null,	null,	0,	null,	null,	1,	'F',	'1999-07-22');
COMMIT;

-- PROFESIONAL_OBRA_SOCIAL
INSERT INTO `clinica_rosa_db`.`usuario_obra_social` (`id_profesional`, `id_obra_social`) VALUES 
(2,	1),
(2,	2),
(2,	3),
(3,	1),
(3,	2),
(3,	3),
(3,	4),
(4,	1),
(4,	2),
(4,	6),
(4,	7),
(5,	1),
(5,	3),
(5,	4),
(5,	7),
(6,	1),
(6,	3),
(6,	4),
(7,	1),
(7,	2),
(7,	6),
(8,	1),
(8,	2),
(8,	3),
(8,	4),
(9,	1),
(9,	2),
(9,	3);
COMMIT;















