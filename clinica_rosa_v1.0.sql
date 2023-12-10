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
  `nombre` varchar(20) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `clinica_rosa_db`.`obra_social` (`id`, `nombre`, `descripcion`) VALUES ('1', 'Particular', '');

CREATE TABLE `clinica_rosa_db`.`usuario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(20) NOT NULL,
  `apellido` VARCHAR(20) NOT NULL,
  `dni` VARCHAR(10) NOT NULL,
  `telefono` VARCHAR(15) NULL,
  `email` VARCHAR(40) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `matricula` VARCHAR(10) NULL UNIQUE,
  `nroAfiliado` VARCHAR(20) NULL,
  `rol` INT NOT NULL,
  `id_especialidad` INT NULL,
  `id_horario` INT NULL,
  `id_obra_social` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `especialidad_idx` (`id_especialidad` ASC) VISIBLE,
  INDEX `horario_idx` (`id_horario` ASC) VISIBLE,
  INDEX `obra_social_idx` (`id_obra_social` ASC) VISIBLE,
  CONSTRAINT `especialidad`
    FOREIGN KEY (`id_especialidad`)
    REFERENCES `clinica_rosa_db`.`especialidad` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `horario`
    FOREIGN KEY (`id_horario`)
    REFERENCES `clinica_rosa_db`.`horario` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `obra_social`
    FOREIGN KEY (`id_obra_social`)
    REFERENCES `clinica_rosa_db`.`obra_social` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE);



