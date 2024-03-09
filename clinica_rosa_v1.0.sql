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

-- TURNOS
INSERT INTO `clinica_rosa_db`.`turno` (`fecha`, `hora`, `estado`, `observaciones`, `id_profesional`, `id_paciente`) VALUES
('2024-01-08',	'09:00:00',	'Concretado',	'Paciente se presenta con molestias lumbares.Se recomienda reposo y estudios a realizar.',	2,	10),
('2024-01-15',	'14:30:00',	'Concretado',	'',	2,	10),
('2024-01-22',	'15:00:00',	'Ausente',	'',	2,	10),
('2024-02-06',	'10:00:00',	'Cancelado',	'',	9,	10),
('2024-02-13',	'13:00:00',	'Concretado',	'Problemas de Vista. Se recetan lentes',	9,	10),
('2024-02-20',	'14:00:00',	'Concretado',	'Revision y prueba de lentes.',	9,	10),
('2024-01-12',	'16:00:00',	'Concretado',	'Paciente se presenta con problemas auditivos de la oreja izq.Se genera orden de estudios.',	5,	11),
('2024-01-19',	'14:30:00',	'Concretado',	'',	5,	11),
('2024-01-23',	'10:00:00',	'Concretado',	'',	4,	11),
('2024-01-30',	'13:00:00',	'Cancelado',	'',	4,	11),
('2024-01-08',	'12:00:00',	'Concretado',	'Problemas de Vista. Se recetan lentes',	8,	12),
('2024-01-17',	'13:00:00',	'Cancelado',	'Problemas de Vista. Se recetan lentes',	8,	12),
('2024-01-22',	'14:00:00',	'Concretado',	'Problemas de Vista. Se recetan lentes',	8,	12),
('2024-01-29',	'15:30:00',	'Concretado',	'',	8,	12),
('2024-02-13',	'13:30:00',	'Concretado',	'Paciente vienen por Acne. Se receta Medicamentos correspondientes.',	9,	12),
('2024-02-22',	'10:30:00',	'Concretado',	'Paciente vienen por Acne. Se receta Medicamentos correspondientes.',	9,	12),
('2024-02-27',	'11:00:00',	'Concretado',	'Paciente vienen por Acne. Se receta Medicamentos correspondientes.',	9,	12),
('2024-03-04',	'10:00:00',	'Concretado',	'Problemas de Vista. Se deriva con los estudios correspondientes',	3,	17),
('2024-03-13',	'10:30:00',	'Concretado',	'Se analizan estudios. Todo ok',	3,	17),
('2024-03-29',	'11:00:00',	'Concretado',	'Problemas de Vista. Se recetan lentes',	3,	17),
('2024-03-04',	'12:00:00',	'Concretado',	'Problemas de Vista. Se recetan lentes',	3,	14),
('2024-03-13',	'13:00:00',	'Cancelado',	'',	3,	14),
('2024-03-29',	'15:00:00',	'Concretado',	'Problemas de Vista. Se recetan lentes',	3,	14),
('2024-03-04',	'09:00:00',	'Concretado',	'',	7,	15),
('2024-03-15',	'09:30:00',	'Concretado',	'',	7,	15),
('2024-03-20',	'10:00:00',	'Cancelado',	'',	7,	15),
('2024-03-04',	'11:00:00',	'Concretado',	'',	7,	16),
('2024-03-15',	'13:30:00',	'Concretado',	'',	7,	16),
('2024-03-20',	'11:30:00',	'Concretado',	'',	7,	16),
('2024-03-27',	'14:00:00',	'Concretado',	'',	7,	16),
('2024-03-04',	'09:00:00',	'Concretado',	'Fractura de huesos largos: Una fractura en un hueso largo como el fémur o el húmero, que puede requerir inmovilización y posiblemente cirugía para una recuperación completa.',	2,	10),
('2024-03-15',	'09:30:00',	'Concretado',	'Luxación de articulaciones: Desplazamiento de una articulación fuera de su posición normal, que puede causar dolor intenso y requerir manipulación o reducción para volver a su posición correcta.',	2,	11),
('2024-03-20',	'10:00:00',	'Concretado',	'Esguince de ligamentos: Lesión en los ligamentos que sostienen una articulación, causada por estiramiento o desgarro parcial, que puede provocar hinchazón, dolor y limitación del movimiento.',	2,	12),
('2024-03-04',	'11:00:00',	'Concretado',	'Lesión de tejidos blandos: Daño en los músculos, tendones o tejido conectivo alrededor de una articulación, generalmente causado por un trauma contundente, que puede causar dolor y limitación del movimiento.',	2,	13),
('2024-03-15',	'12:00:00',	'Concretado',	'Fractura por estrés: Fractura causada por el uso excesivo o repetido de un hueso, comúnmente observada en deportistas o personas que participan en actividades físicas intensas.',	2,	15),
('2024-03-20',	'13:00:00',	'Cancelado',	'',	2,	16),
('2024-03-27',	'14:00:00',	'Cancelado',	'',	2,	17),
('2024-03-05',	'10:00:00',	'Concretado',	'Afección cutánea crónica caracterizada por picazón, enrojecimiento y sequedad de la piel, que puede ser desencadenada por alergias o factores ambientales.',	4,	10),
('2024-03-14',	'10:30:00',	'Concretado',	'Infecciones por hongos en la piel (dermatofitosis): Infecciones fúngicas comunes de la piel, como el pie de atleta, la tiña inguinal o la tiña corporal, que pueden causar picazón, enrojecimiento y descamación',	4,	11),
('2024-03-14',	'11:00:00',	'Concretado',	'Dermatitis seborreica: Una afección cutánea crónica que causa enrojecimiento, descamación y picazón en áreas grasosas de la piel como el cuero cabelludo, la cara y la parte superior del cuerpo.',	4,	13),
('2024-03-28',	'13:00:00',	'Concretado',	'Psoriasis: Una enfermedad autoinmune que provoca la formación de parches de piel gruesa, enrojecida y con escamas plateadas, que pueden causar picazón e incomodidad.',	4,	15),
('2024-03-28',	'13:30:00',	'Concretado',	'Urticaria: Una reacción alérgica que causa la aparición repentina de ronchas rojas y elevadas en la piel, acompañadas de picazón intensa, que puede ser desencadenada por alimentos, medicamentos, picaduras de insectos u otros alérgenos.',	4,	16),
('2024-03-05',	'14:00:00',	'Cancelado',	'',	4,	17),
('2024-03-15',	'13:00:00',	'Concretado',	'Otitis media: Inflamación del oído medio, generalmente causada por infecciones bacterianas o virales, que puede provocar dolor de oído, sensación de plenitud, pérdida auditiva temporal y fiebre.',	5,	17),
('2024-03-15',	'14:00:00',	'Concretado',	'Sinusitis: Inflamación de los senos paranasales debido a infecciones bacterianas, virales o fúngicas, que puede causar congestión nasal, presión facial, dolor de cabeza, tos y secreción nasal espesa.',	5,	12),
('2024-03-15',	'17:00:00',	'Concretado',	'Amigdalitis: Inflamación de las amígdalas, generalmente causada por infecciones bacterianas o virales, que puede provocar dolor de garganta intenso, dificultad para tragar, fiebre y ganglios linfáticos inflamados en el cuello.',	5,	14),
('2024-03-06',	'14:30:00',	'Concretado',	'Conjuntivitis: Inflamación de la membrana transparente que recubre la parte blanca del ojo y el interior de los párpados, generalmente causada por infecciones virales, bacterianas o alérgicas, que puede provocar enrojecimiento, picazón, secreción y sensación de cuerpo extraño en el ojo.',	8,	17),
('2024-03-06',	'15:00:00',	'Concretado',	'Miopía: Un error de refracción del ojo que dificulta la visión de objetos distantes, generalmente debido a una longitud excesiva del globo ocular o una curvatura excesiva de la córnea, lo que hace que las imágenes se enfoquen delante de la retina en lugar de sobre ella.',	8,	14),
('2024-03-06',	'15:30:00',	'Concretado',	'Astigmatismo: Un error de refracción del ojo causado por una curvatura irregular de la córnea o del cristalino, lo que provoca una visión borrosa tanto de objetos cercanos como lejanos',	8,	10),
('2024-03-06',	'16:00:00',	'Concretado',	'Cataratas: Opacidad del cristalino del ojo, generalmente asociada con el envejecimiento, que puede causar visión borrosa, sensibilidad a la luz, visión doble y dificultad para ver en condiciones de poca luz.',	8,	11);
COMMIT;

















