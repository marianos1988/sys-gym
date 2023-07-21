-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 21-07-2023 a las 16:27:54
-- Versión del servidor: 10.4.21-MariaDB
-- Versión de PHP: 7.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `scapegym`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `caja`
--

CREATE TABLE `caja` (
  `id_caja` int(40) NOT NULL,
  `concepto` varchar(125) DEFAULT NULL,
  `importe` int(50) NOT NULL,
  `modo_de_pago` varchar(25) CHARACTER SET utf8 COLLATE utf8_spanish_ci DEFAULT NULL,
  `fecha_de_pago` date NOT NULL,
  `tipo_de_caja` varchar(50) CHARACTER SET utf8 COLLATE utf8_spanish_ci DEFAULT NULL,
  `eliminado` tinyint(1) DEFAULT NULL,
  `fecha_eliminado` date DEFAULT NULL,
  `id_quien_elimino` int(11) DEFAULT NULL,
  `usuario_quien_elimino` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `caja`
--

INSERT INTO `caja` (`id_caja`, `concepto`, `importe`, `modo_de_pago`, `fecha_de_pago`, `tipo_de_caja`, `eliminado`, `fecha_eliminado`, `id_quien_elimino`, `usuario_quien_elimino`) VALUES
(1, 'sdfsdfdsf', 3000, 'Debito', '2023-04-27', 'Ingreso', 0, NULL, NULL, NULL),
(2, 'Cuota por un dia', 2000, 'Efectivo', '2023-04-27', 'Ingreso', 0, NULL, NULL, NULL),
(3, 'Cuota por un dia', 2500, 'Efectivo', '2023-04-27', 'Ingreso', 0, NULL, NULL, NULL),
(4, 'Ferreteria', 1000, 'Transferencia', '2023-04-27', 'Egreso', 0, NULL, NULL, NULL),
(5, 'Kiosco', 1000, 'Efectivo', '2023-04-27', 'Egreso', 0, NULL, NULL, NULL),
(6, 'jojojo', 700, 'Efectivo', '2023-04-27', 'Ingreso', 0, NULL, NULL, NULL),
(7, 'Cuota por un dia', 1000, 'Debito', '2023-04-27', 'Ingreso', 0, NULL, NULL, NULL),
(8, 'Kiosco', 500, 'Transferencia', '2023-04-27', 'Egreso', 0, NULL, NULL, NULL),
(9, 'Debian Plata', 3000, 'Efectivo', '2023-04-27', 'Ingreso', 0, NULL, NULL, NULL),
(12, 'Ingresar a caja', 5000, 'Efectivo', '2023-04-28', 'Ingreso', 0, NULL, NULL, NULL),
(13, 'Cuota diaria', 2000, 'Efectivo', '2023-04-28', 'Ingreso', 0, NULL, NULL, NULL),
(14, 'safsafds', 1500, 'Efectivo', '2023-04-28', 'Egreso', 0, NULL, NULL, NULL),
(15, 'Vino Lucas y dejo plata', 3500, 'Debito', '2023-04-30', 'Ingreso', 0, NULL, NULL, NULL),
(16, 'Sarasa', 3000, 'Debito', '2023-04-30', 'Ingreso', 0, NULL, NULL, NULL),
(17, 'nuevo importe sarasa', 2500, 'Debito', '2023-04-30', 'Ingreso', 0, NULL, NULL, NULL),
(18, 'sarasa 1', 5000, 'Efectivo', '2023-04-30', 'Egreso', 0, NULL, NULL, NULL),
(19, 'sssss', 2000, 'Debito', '2023-04-30', 'Egreso', 0, NULL, NULL, NULL),
(20, 'sarasa 3', 2000, 'Transferencia', '2023-04-30', 'Egreso', 0, NULL, NULL, NULL),
(21, 'Socio paga el dia', 2000, 'Debito', '2023-05-01', 'Ingreso', 1, '2023-05-01', 2, 'recepcion'),
(22, '12345678901234567890123456789012345678', 1500, 'Efectivo', '2023-05-02', 'Ingreso', 0, NULL, NULL, NULL),
(23, 'Pago el dia del gym', 2000, 'Efectivo', '2023-05-15', 'Ingreso', 0, NULL, NULL, NULL),
(24, 'Electricista reparacion', 3000, 'Efectivo', '2023-05-15', 'Egreso', 0, NULL, NULL, NULL),
(25, 'Cuota por un dia', 2000, 'Efectivo', '2023-06-07', 'Ingreso', 0, NULL, NULL, NULL),
(26, 'arreglo maquina', 5000, 'Efectivo', '2023-06-07', 'Egreso', 0, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `forma_de_caja`
--

CREATE TABLE `forma_de_caja` (
  `tipo_de_caja` varchar(45) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `forma_de_caja`
--

INSERT INTO `forma_de_caja` (`tipo_de_caja`) VALUES
('Egreso'),
('Ingreso');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `forma_de_pago`
--

CREATE TABLE `forma_de_pago` (
  `modo_de_pago` varchar(25) COLLATE utf8_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `forma_de_pago`
--

INSERT INTO `forma_de_pago` (`modo_de_pago`) VALUES
('Debito'),
('Efectivo'),
('Transferencia');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `id_pago` int(30) NOT NULL,
  `id_socio` int(30) NOT NULL,
  `importe` int(7) NOT NULL,
  `modo_de_pago` varchar(25) CHARACTER SET utf8 COLLATE utf8_spanish_ci DEFAULT NULL,
  `fecha_de_pago_completo` date NOT NULL,
  `cuota_mensual` date NOT NULL,
  `observacion` varchar(100) NOT NULL,
  `eliminado` tinyint(1) DEFAULT NULL,
  `fecha_eliminado` date DEFAULT NULL,
  `id_quien_elimino` int(11) DEFAULT NULL,
  `usuario_quien_elimino` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `pagos`
--

INSERT INTO `pagos` (`id_pago`, `id_socio`, `importe`, `modo_de_pago`, `fecha_de_pago_completo`, `cuota_mensual`, `observacion`, `eliminado`, `fecha_eliminado`, `id_quien_elimino`, `usuario_quien_elimino`) VALUES
(295, 35, 5000, 'Debito', '2023-03-15', '2023-01-01', 'Paga Enero', 0, NULL, 0, ''),
(296, 35, 5000, 'Debito', '2023-03-15', '2023-02-01', '', 0, NULL, 0, ''),
(297, 35, 6000, 'Efectivo', '2023-03-15', '2023-03-01', '', 0, NULL, 0, ''),
(316, 38, 4500, 'Transferencia', '2023-03-17', '2023-01-01', '', 0, NULL, 0, ''),
(317, 38, 4500, 'Efectivo', '2023-02-10', '2023-02-01', '', 0, NULL, 0, ''),
(318, 38, 3000, 'Efectivo', '2023-03-17', '2023-03-01', 'prueba', 0, NULL, 0, ''),
(346, 33, 5000, 'Efectivo', '2023-03-22', '2023-03-01', 'asdfds', 0, NULL, NULL, NULL),
(347, 39, 5000, 'Efectivo', '2023-01-22', '2023-01-01', '', 0, NULL, NULL, NULL),
(348, 40, 10000, 'Transferencia', '2023-03-22', '2023-02-01', '', 0, NULL, 0, ''),
(349, 41, 5000, 'Debito', '2023-03-22', '2023-01-01', '', 0, NULL, 0, ''),
(350, 42, 5000, 'Efectivo', '2023-01-22', '2023-01-01', ' gimnasioojhsadgsahjdsagdjsad', 0, NULL, 0, ''),
(351, 42, 5000, 'Efectivo', '2023-03-22', '2023-02-01', '', 0, NULL, 0, ''),
(356, 51, 3000, 'Efectivo', '2023-03-29', '2023-01-01', '', 0, NULL, 0, ''),
(359, 52, 5000, 'Debito', '2023-03-31', '2023-01-01', 'Arranca el gym', 0, NULL, 0, ''),
(365, 52, 5000, 'Debito', '2023-05-01', '2023-05-01', '', 0, NULL, 0, ''),
(369, 33, 5000, 'Debito', '2023-04-08', '2023-04-01', 'Segunda Cuota', 0, NULL, NULL, NULL),
(370, 53, 4500, 'Efectivo', '2023-04-09', '2023-01-01', 'Arranca el gimnasio', 0, NULL, 0, ''),
(372, 55, 5000, 'Transferencia', '2023-04-12', '2023-02-01', 'Arranca gim', 0, NULL, NULL, NULL),
(373, 33, 5000, 'Efectivo', '2023-04-13', '2023-02-01', 'asdasd', 0, NULL, NULL, NULL),
(380, 35, 5000, 'Transferencia', '2023-04-13', '2023-04-01', '', 0, NULL, NULL, NULL),
(381, 56, 4000, 'Efectivo', '2023-02-13', '2023-02-01', '', 0, NULL, NULL, NULL),
(382, 56, 5000, 'Efectivo', '2023-01-13', '2023-01-01', '', 0, NULL, NULL, NULL),
(384, 39, 5000, 'Efectivo', '2023-01-13', '2023-02-01', '', 0, NULL, NULL, NULL),
(410, 69, 5000, 'Debito', '2023-04-17', '2023-04-01', 'prueba', 0, NULL, NULL, NULL),
(418, 77, 5000, 'Debito', '2023-04-19', '2023-04-01', 'asd', 0, NULL, NULL, NULL),
(419, 78, 5000, 'Efectivo', '2023-04-20', '2023-04-01', 'Arranca el Gym', 0, NULL, NULL, NULL),
(420, 79, 5000, 'Efectivo', '2023-04-20', '2023-04-01', 'asdasd', 0, NULL, NULL, NULL),
(421, 33, 4000, 'Efectivo', '2023-04-21', '2023-01-01', 'dsf', 0, NULL, NULL, NULL),
(422, 80, 4500, 'Transferencia', '2023-04-22', '2023-04-01', 'Arranca gym', 0, NULL, NULL, NULL),
(423, 81, 5000, 'Transferencia', '2023-04-22', '2023-04-01', '', 0, NULL, NULL, NULL),
(424, 82, 6000, 'Debito', '2023-04-22', '2023-04-01', '', 0, NULL, NULL, NULL),
(425, 83, 5000, 'Efectivo', '2023-04-25', '2023-04-01', 'Arranca el gym', 0, NULL, NULL, NULL),
(431, 33, 5000, 'Debito', '2023-04-27', '2023-05-01', '12345678901234567890123456789012345678', 0, NULL, NULL, NULL),
(432, 52, 5000, 'Efectivo', '2023-04-27', '2023-06-01', '', 0, NULL, NULL, NULL),
(433, 69, 5000, 'Debito', '2023-04-27', '2023-05-01', '', 0, NULL, NULL, NULL),
(434, 78, 5000, 'Debito', '2023-04-27', '2023-05-01', '', 0, NULL, NULL, NULL),
(437, 38, 5000, 'Efectivo', '2023-04-29', '2023-05-01', '', 0, NULL, NULL, NULL),
(438, 42, 5000, 'Transferencia', '2023-04-30', '2023-04-01', 'Volvio y pago cuota', 0, NULL, NULL, NULL),
(439, 84, 5500, 'Debito', '2023-04-30', '2023-04-01', 'Arranca el gym', 0, NULL, NULL, NULL),
(440, 84, 5000, 'Efectivo', '2023-04-30', '2023-05-01', '', 0, NULL, NULL, NULL),
(441, 84, 12000, 'Efectivo', '2023-04-30', '2023-06-01', 'Promo mes 1', 0, NULL, NULL, NULL),
(442, 84, 0, 'Efectivo', '2023-04-30', '2023-07-01', 'Promo mes 2', 0, NULL, NULL, NULL),
(443, 84, 0, 'Efectivo', '2023-04-30', '2023-08-01', 'Promo mes 3', 0, NULL, NULL, NULL),
(444, 41, 5000, 'Debito', '2023-05-01', '2023-05-01', 'Vuelve a entrenar', 0, NULL, NULL, NULL),
(445, 38, 3700, 'Efectivo', '2023-05-01', '2023-06-01', 'Promqwewqeo', 0, NULL, NULL, NULL),
(446, 87, 5000, 'Efectivo', '2023-05-02', '2023-05-01', '', 0, NULL, NULL, NULL),
(447, 88, 5000, 'Efectivo', '2023-05-02', '2023-05-01', '', 0, NULL, NULL, NULL),
(448, 88, 5000, 'Efectivo', '2023-05-02', '2023-06-01', '', 0, NULL, NULL, NULL),
(449, 89, 5000, 'Transferencia', '2023-05-02', '2023-05-01', 'asdsadsadadasdadsadsadasdasdsadasd', 0, NULL, NULL, NULL),
(450, 38, 6000, 'Debito', '2023-05-02', '2023-07-01', '', 0, NULL, NULL, NULL),
(451, 38, 6000, 'Efectivo', '2023-05-02', '2023-08-01', '', 0, NULL, NULL, NULL),
(452, 90, 5000, 'Debito', '2023-05-05', '2023-05-01', 'Comienza el Gym', 0, NULL, NULL, NULL),
(453, 90, 5000, 'Transferencia', '2023-05-05', '2023-04-01', 'ASD', 0, NULL, NULL, NULL),
(454, 91, 5000, 'Efectivo', '2023-05-15', '2023-05-01', 'Arranca gym', 0, NULL, NULL, NULL),
(455, 93, 6000, 'Debito', '2023-06-02', '2023-06-01', 'Arranca el Gym', 0, NULL, NULL, NULL),
(456, 33, 5000, 'Debito', '2023-06-02', '2023-06-01', '', 0, NULL, NULL, NULL),
(457, 81, 5000, 'Efectivo', '2023-06-02', '2023-05-01', '', 0, NULL, NULL, NULL),
(458, 56, 5000, 'Efectivo', '2023-06-02', '2023-03-01', '', 0, NULL, NULL, NULL),
(459, 90, 5000, 'Efectivo', '2023-06-03', '2023-06-01', '', 0, NULL, NULL, NULL),
(460, 94, 5000, 'Efectivo', '2023-06-03', '2023-06-01', 'asdasd', 0, NULL, NULL, NULL),
(462, 39, 5000, 'Efectivo', '2023-06-06', '2023-06-01', '', 0, NULL, NULL, NULL),
(463, 95, 8000, 'Efectivo', '2023-06-07', '2023-06-01', 'boxeo y gym', 0, NULL, NULL, NULL),
(464, 35, 2222, 'Transferencia', '2023-06-07', '2023-05-01', '', 0, NULL, NULL, NULL),
(465, 55, 5000, 'Efectivo', '2023-06-07', '2023-06-01', 'vuelve a entrenar', 0, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `socios`
--

CREATE TABLE `socios` (
  `id_socio` int(10) NOT NULL,
  `nro_socio` int(20) NOT NULL,
  `nombres` varchar(50) NOT NULL,
  `apellidos` varchar(50) NOT NULL,
  `dni` int(50) NOT NULL,
  `domicilio` varchar(125) DEFAULT NULL,
  `mail` varchar(70) DEFAULT NULL,
  `telefono` int(11) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `fecha_registracion` date DEFAULT NULL,
  `fecha_reactivacion` date DEFAULT NULL,
  `estado` tinyint(1) NOT NULL,
  `eliminado` tinyint(1) DEFAULT NULL,
  `fecha_eliminado` date DEFAULT NULL,
  `id_quien_elimino` int(11) DEFAULT NULL,
  `usuario_quien_elimino` varchar(50) DEFAULT NULL,
  `fecha_cumpleanos` int(20) DEFAULT NULL,
  `mes_cumpleanos` int(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `socios`
--

INSERT INTO `socios` (`id_socio`, `nro_socio`, `nombres`, `apellidos`, `dni`, `domicilio`, `mail`, `telefono`, `fecha_nacimiento`, `fecha_registracion`, `fecha_reactivacion`, `estado`, `eliminado`, `fecha_eliminado`, `id_quien_elimino`, `usuario_quien_elimino`, `fecha_cumpleanos`, `mes_cumpleanos`) VALUES
(33, 1234, 'Mariano ', 'Szencis Yans', 12345678, '', 'asd@asd.com', 12341234, '1980-04-23', '2023-03-05', NULL, 1, 0, NULL, NULL, NULL, 23, 4),
(35, 2007, 'Damian', 'Delias', 12341234, '', 'juan@asd.com', 12341234, '2000-05-01', '2023-03-03', NULL, 1, 0, NULL, NULL, NULL, 1, 5),
(38, 12341234, 'Juan Manuel', 'Rodriguez', 123412345, '', 'asd@asd.com', 123456789, '1997-05-18', '2023-03-17', NULL, 1, 0, NULL, NULL, NULL, 18, 5),
(39, 5555, 'Santiago', 'De las Carreras', 55555555, 'Santiago de las carreras 430', 'asd@asd.com', 22223333, '2000-04-28', '2023-03-22', NULL, 1, 0, NULL, NULL, NULL, 28, 4),
(40, 1010, 'Roman', 'Riquelme', 1010101011, '', 'asd@asd.com', 123456, '1980-04-24', '2023-03-22', NULL, 0, 0, NULL, NULL, NULL, 24, 4),
(41, 3311, 'Raul', 'Dominguez', 2147483647, '', 'asd@asd.com', NULL, '2005-04-23', '2023-03-22', NULL, 1, 0, NULL, NULL, NULL, 23, 4),
(42, 2211, 'Ayelen', 'Melo', 1234567899, '', 'asd@asd.com', NULL, '1980-01-01', '2023-03-22', '2023-06-08', 1, 0, NULL, NULL, NULL, 1, 1),
(50, 2000, 'Marcos', 'asdsadsad', 33445566, '', '', NULL, '1980-01-01', '2023-03-29', NULL, 1, 0, NULL, NULL, NULL, 1, 1),
(51, 2143, 'Nahuel', 'Huapi', 22345987, '', '', NULL, '1980-01-01', '2023-03-29', NULL, 0, 1, NULL, NULL, NULL, 1, 1),
(52, 2008, 'Marcos', 'Lopez', 43214321, 'Alcaraz 5100', '', NULL, '1980-04-30', '2023-04-01', NULL, 1, 0, NULL, NULL, NULL, 30, 4),
(53, 1356, 'Carlos', 'Nuñez', 24567223, '', 'jota@hotmail.com', NULL, '1980-01-01', '2023-04-09', '2023-06-08', 1, 0, NULL, NULL, NULL, 1, 1),
(54, 2323, 'Nicolas', 'Sanchez', 22332233, '', '', NULL, '1980-01-01', '2023-04-12', NULL, 1, 0, NULL, NULL, NULL, 1, 1),
(55, 1229, 'Marcos', 'Gimenez', 33344478, '', 'asd@asd.com', 1234456788, '1980-01-01', '2023-04-12', '2023-06-07', 1, 0, NULL, NULL, NULL, 1, 1),
(56, 7890, 'Tomas', 'Aimi', 12344321, '', '', NULL, '1980-01-01', '2023-04-13', NULL, 1, 0, NULL, NULL, NULL, 1, 1),
(57, 6549, 'Marcos', 'Gomez', 45674343, '', '', NULL, '1980-01-01', '2023-04-13', NULL, 1, 0, NULL, NULL, NULL, 1, 1),
(58, 1231, 'Carlos', 'Suarez', 2033449087, 'Cervantes 1523', 'asd@asd.com', 123456789, '1980-01-01', '2023-04-14', NULL, 1, 0, NULL, NULL, NULL, 1, 1),
(59, 3337, 'Bruno', 'Perez', 23445667, '', '', NULL, '1980-01-01', '2023-04-14', NULL, 1, 0, NULL, NULL, NULL, 1, 1),
(69, 1212, 'Martin', 'Gomez', 12121212, '', '', NULL, '1980-01-01', '2023-04-17', NULL, 1, 0, NULL, NULL, NULL, 1, 1),
(77, 2424, 'Hernan', 'Diaz', 24242424, '', 'asd@asd.com', NULL, '1910-10-10', '2023-04-19', '2023-06-08', 1, 0, NULL, NULL, NULL, 10, 10),
(78, 5688, 'Damian', 'Sosa', 30255646, 'Av. Segurola 1888', 'damiancito@gmail.com', 1544337766, '1998-02-15', '2023-04-20', NULL, 1, 0, NULL, NULL, NULL, 15, 2),
(79, 2400, 'Juan', 'Ponce', 40113908, 'Miranda 4888', 'juancito@hotmail.com', 1140403554, '1971-07-14', '2023-04-20', '2023-06-08', 1, 0, NULL, NULL, NULL, 14, 7),
(80, 2004, 'Ruben Manuel', 'Gonzalez', 20567894, 'Av. Jonte 5660', 'rubencito@hotmail.com', 1523236789, '1997-01-20', '2023-04-22', NULL, 1, 0, NULL, NULL, NULL, 20, 1),
(81, 3356, 'Tomas', 'Heredia', 45678876, 'Lascano 5656', 'tomas@asd.com', 12341234, '1988-01-15', '2023-04-22', NULL, 1, 0, NULL, NULL, NULL, 15, 1),
(82, 1002, 'Gaston', 'Navas', 25678905, 'Santo tome 5240', 'gastoncito@hotmail.com', 11112222, '0000-00-00', '2023-04-22', '2023-06-08', 1, 0, NULL, NULL, NULL, NULL, NULL),
(83, 1999, 'Mariano', 'Gomez', 1234123455, 'Jonte 5200', 'asd@asd.com', 1512341234, '2011-05-12', '2023-04-25', NULL, 1, 0, NULL, NULL, NULL, 12, 5),
(84, 123123, 'Firulais', 'Montoto', 343456798, 'Jonte 5600', 'sarasa@gmail.com', 1123232323, '2000-04-30', '2023-04-30', NULL, 1, 0, NULL, NULL, NULL, 30, 4),
(85, 7896, 'Eugenio', 'Sarasa', 2147483647, 'Segurola 1800', 'eushoin@hotmail.com', 1567678989, '1990-01-10', '2023-05-01', NULL, 1, 0, NULL, NULL, NULL, 10, 1),
(86, 123456, 'Eugenio', 'Sarasa', 2147483647, 'Segurola 1800', 'eushoin@hotmail.com', 1567678989, '1990-01-10', '2023-05-01', NULL, 1, 0, NULL, NULL, NULL, 10, 1),
(87, 33222, 'Santiago', 'Aguilar', 11113333, '', '', NULL, '0000-00-00', '2023-05-02', NULL, 1, 0, NULL, NULL, NULL, NULL, NULL),
(88, 4566, 'Martin', 'Larosa', 44565789, '', '', NULL, '0000-00-00', '2023-05-02', NULL, 1, 0, NULL, NULL, NULL, NULL, NULL),
(89, 1222, 'Jorge', 'Diaz', 43221620, '', 'jorgelin@hotmail.com', 1523545098, '0000-00-00', '2023-05-02', NULL, 1, 0, NULL, NULL, NULL, NULL, NULL),
(90, 6644, 'Juan', 'Perez', 20666230, 'Lope de Vega 5233', 'asd@asd.com', 1123234444, '2023-05-05', '2023-05-05', NULL, 1, 0, NULL, NULL, NULL, 5, 5),
(91, 3005, 'Raul', 'Gimenez', 1234444412, '', 'asd@asd.com', NULL, '1990-05-15', '2023-05-15', NULL, 1, 0, NULL, NULL, NULL, 15, 5),
(93, 9988, 'Martin', 'Campaña', 44566667, 'asdff', 'asd@asd.com', 12341234, '2023-06-02', '2023-06-02', NULL, 1, 0, NULL, NULL, NULL, 2, 6),
(94, 7744, 'Fernando', 'Castro', 25210210, 'Belaustegui 5200', 'sarasa@gmail.com', 66668888, '1999-06-14', '2023-06-03', NULL, 1, 0, NULL, NULL, NULL, 14, 6),
(95, 4545, 'Matias', 'Gomez', 1123232323, '', '', NULL, '1988-06-07', '2023-06-07', NULL, 1, 0, NULL, NULL, NULL, 7, 6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `usuario`, `password`) VALUES
(2, 'recepcion', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4'),
(4, 'marcelo', '0356606d70b1e05ea65231e626413f5e98c073d2ed56851db01dcc3ee802fa55'),
(5, 'betina', '0356606d70b1e05ea65231e626413f5e98c073d2ed56851db01dcc3ee802fa55'),
(6, 'tomas', '0356606d70b1e05ea65231e626413f5e98c073d2ed56851db01dcc3ee802fa55');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `caja`
--
ALTER TABLE `caja`
  ADD PRIMARY KEY (`id_caja`),
  ADD KEY `modoPago` (`modo_de_pago`),
  ADD KEY `ModoCaja` (`tipo_de_caja`);

--
-- Indices de la tabla `forma_de_caja`
--
ALTER TABLE `forma_de_caja`
  ADD PRIMARY KEY (`tipo_de_caja`);

--
-- Indices de la tabla `forma_de_pago`
--
ALTER TABLE `forma_de_pago`
  ADD PRIMARY KEY (`modo_de_pago`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id_pago`),
  ADD KEY `socios_id_socios_pagos` (`id_socio`),
  ADD KEY `modo_de_pago` (`modo_de_pago`);

--
-- Indices de la tabla `socios`
--
ALTER TABLE `socios`
  ADD PRIMARY KEY (`id_socio`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `caja`
--
ALTER TABLE `caja`
  MODIFY `id_caja` int(40) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id_pago` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=469;

--
-- AUTO_INCREMENT de la tabla `socios`
--
ALTER TABLE `socios`
  MODIFY `id_socio` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `caja`
--
ALTER TABLE `caja`
  ADD CONSTRAINT `ModoCaja` FOREIGN KEY (`tipo_de_caja`) REFERENCES `forma_de_caja` (`tipo_de_caja`),
  ADD CONSTRAINT `modoPago` FOREIGN KEY (`modo_de_pago`) REFERENCES `forma_de_pago` (`modo_de_pago`);

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`modo_de_pago`) REFERENCES `forma_de_pago` (`modo_de_pago`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
