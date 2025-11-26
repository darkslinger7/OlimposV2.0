-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-11-2025 a las 21:01:04
-- Versión del servidor: 8.0.44
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `convivir_bd`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `avisos`
--

CREATE TABLE `avisos` (
  `id_aviso` int NOT NULL,
  `titulo` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `mensaje` text COLLATE utf8mb4_general_ci NOT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `id_emisor` int NOT NULL,
  `rol_emisor` enum('super','administrador','trabajador','cliente') COLLATE utf8mb4_general_ci NOT NULL,
  `rol_destino` enum('administrador','trabajador','cliente') COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cargo`
--

CREATE TABLE `cargo` (
  `id_cargo` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cargo`
--

INSERT INTO `cargo` (`id_cargo`, `nombre`) VALUES
(2, 'administrador'),
(4, 'residente'),
(1, 'superusuario'),
(3, 'trabajador');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id_cliente` int NOT NULL,
  `id_usuario` int NOT NULL,
  `hotel` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `apartamento` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha_registro` date DEFAULT NULL,
  `id_hotel` int DEFAULT NULL,
  `id_habitacion` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `habitaciones`
--

CREATE TABLE `habitaciones` (
  `id_habitacion` int NOT NULL,
  `id_hotel` int NOT NULL,
  `numero` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `tipo` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `capacidad` int DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `estado` enum('disponible','ocupada','mantenimiento') COLLATE utf8mb4_general_ci DEFAULT 'disponible',
  `tiene_televisor` tinyint(1) DEFAULT '0',
  `tiene_wifi` tinyint(1) DEFAULT '0',
  `tiene_jacuzzi` tinyint(1) DEFAULT '0',
  `tiene_aire` tinyint(1) DEFAULT '0',
  `tiene_minibar` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_pagos`
--

CREATE TABLE `historial_pagos` (
  `id_pago` int NOT NULL,
  `id_hotel` int DEFAULT NULL,
  `id_admin` int DEFAULT NULL,
  `monto` decimal(10,2) DEFAULT NULL,
  `fecha_pago` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `hoteles`
--

CREATE TABLE `hoteles` (
  `id_hotel` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `direccion` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `telefono` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha_registro` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `hoteles`
--

INSERT INTO `hoteles` (`id_hotel`, `nombre`, `direccion`, `telefono`, `email`, `fecha_registro`) VALUES
(1, 'Oasis', 'Carrera 3 calle 5, Chichiriviche Falcon', '04125555555', 'eloasis@gmail.com', '2025-11-09'),
(2, 'Atenea', 'Carrera 5 calle 7, Catia la Mar Vargas', '04125564554', 'atenea@gmail.com', '2025-11-10'),
(3, 'El Paraiso', 'Carrera 10 calle 9, Porlamar Margarita', '04245648745', 'elparaiso@gmail.com', '2025-11-11'),
(4, 'Brisas del Ocaso', 'Juan Griego Calle La Marina, Margarita', '04125647458', 'ocasobrisas@gmail.com', '2025-11-15'),
(5, 'Posada El Oso', 'San Isidro, Bolivar', '04125648127', 'elosoposada@gmail.com', '2025-11-14');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inf_usuarios`
--

CREATE TABLE `inf_usuarios` (
  `id` int NOT NULL,
  `nombre_apellido` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `usuario` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `clave` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `telefono` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `cedula` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `id_cargo` int NOT NULL,
  `fecha` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `id_habitacion` int DEFAULT NULL,
  `id_hotel` int DEFAULT NULL,
  `id_trabajo` int DEFAULT NULL,
  `sueldo` decimal(10,2) DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inf_usuarios`
--

INSERT INTO `inf_usuarios` (`id`, `nombre_apellido`, `usuario`, `clave`, `email`, `telefono`, `cedula`, `id_cargo`, `fecha`, `id_habitacion`, `id_hotel`, `id_trabajo`, `sueldo`) VALUES
(1, 'Juan Sun', 'adminjuan', '8514218', 'juansun77@gmail.com', '+584120200331', 'V-27617584', 1, '09/11/2025', NULL, NULL, NULL, 0.00),
(36, 'Sofia Rodriguez', 'sofiarod', '31802716', 'sofiarod397@gmail.com', '+584120549159', 'V-31802716', 2, '11/11/2025', NULL, NULL, NULL, 0.00),
(37, 'Johan Torres', 'johantor', '31804754', 'alvaradojohan112@gmail.com', '+584143552866', 'V-31804754', 2, '11/11/2025', NULL, NULL, NULL, 0.00),
(38, 'Juan Mendoza', 'juangpt', '30227089', 'juan.a.m.b.9@gmail.com', '+584145666286', 'V-30227089', 3, '11/11/2025', NULL, NULL, 1, 300.00),
(39, 'Pablo Acevedo', 'pabloac', '30019476', 'pablo36115@gmail.com', '+584128700012', 'V-30019476', 2, '11/11/2025', NULL, NULL, NULL, 0.00),
(40, 'Sofia Rodriguez', 'sofiarod', '31802716', 'sofiarod397@gmail.com', '+584120549159', 'V-31802716', 2, '11/11/2025', NULL, NULL, NULL, 0.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `id_pago` int NOT NULL,
  `num_referencia` int NOT NULL,
  `monto_pago` double(100,2) NOT NULL,
  `tipo_pago` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `fecha_pago` datetime NOT NULL,
  `nombre_p` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `cedula` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `bancoEmisor` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `Torre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `apartamento` varchar(100) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pagos`
--

INSERT INTO `pagos` (`id_pago`, `num_referencia`, `monto_pago`, `tipo_pago`, `fecha_pago`, `nombre_p`, `cedula`, `bancoEmisor`, `Torre`, `apartamento`) VALUES
(10, 637283, 87454.85, 'Pago_Movil', '2025-06-12 00:00:00', 'José Falcón ', 'V-6362772', '0128 - Banesco Banco Universal', 'B', '2-1'),
(12, 321654, 1875.25, 'Pago_Movil', '2025-06-06 09:15:00', 'Carlos Pérez', 'V-18765432', '0104 - Banco Mercantil', 'A', 'PB-2'),
(13, 852963, 9630.00, 'Transferencia', '2025-06-09 11:20:00', 'Luis Martínez', 'V-45632178', '0108 - Banco Provincial', 'C', 'PB-5'),
(14, 147258, 1250.30, 'Pago_Movil', '2025-06-10 13:10:00', 'Laura Sánchez', 'V-78965412', '0138 - Banco del Tesoro', 'D', '4-1'),
(15, 369258, 4587.90, 'Cheque', '2025-06-11 10:05:00', 'Pedro Gómez', 'V-15975346', '0105 - Banco de Venezuela', 'A', 'PB-1'),
(16, 753159, 7825.40, 'Transferencia', '2025-06-13 15:30:00', 'Sofía Hernández', 'V-35795128', '0104 - Banco Mercantil', 'B', '2-2'),
(17, 951357, 3200.00, 'Pago_Movil', '2025-06-14 08:45:00', 'Jorge Díaz', 'V-65478932', '0134 - Banco Bicentenario', 'C', 'PB-3'),
(18, 579246, 6540.25, 'Transferencia', '2025-06-16 12:15:00', 'Ricardo Mendoza', 'V-98732165', '0128 - Banesco Banco Universal', 'A', 'PB-6'),
(19, 465465, 15665.00, 'Transferencia', '2025-06-12 00:00:00', ' Jupiter', 'V-56465415', '0169 - Mi Banco', 'A', '3-3'),
(20, 651651, 5620.00, 'Pago_Movil', '2025-06-13 00:00:00', 'Marcos Perez', 'V-32561465', '0171 - Banco Activo', 'C', '10-3'),
(21, 156123, 9564.00, 'Transferencia', '2025-06-01 00:00:00', 'keni vasquez', 'V-16515163', '0105 - Banco Mercantil', 'A', 'PB-1'),
(22, 156132, 156145.00, 'Pago_Movil', '2025-06-17 00:00:00', 'Carlos Rodriguez', 'V-34567890', '0171 - Banco Activo', 'D', '8-3'),
(23, 625645, 3129.00, 'Pago_Movil', '2025-06-24 00:00:00', 'Maria Gomez', 'V-45678901', '0151 - BFC', 'C', '5-4'),
(24, 216126, 8635.00, 'Transferencia', '2025-06-14 00:00:00', 'Juan Perez', 'V-56789012', '0168 - Bancrecer', 'A', '3-2');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `trabajos`
--

CREATE TABLE `trabajos` (
  `id_trabajo` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_general_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `trabajos`
--

INSERT INTO `trabajos` (`id_trabajo`, `nombre`, `descripcion`) VALUES
(1, 'Amo de furros', 'Cumple fantasias de las furras');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `avisos`
--
ALTER TABLE `avisos`
  ADD PRIMARY KEY (`id_aviso`),
  ADD KEY `id_emisor` (`id_emisor`);

--
-- Indices de la tabla `cargo`
--
ALTER TABLE `cargo`
  ADD PRIMARY KEY (`id_cargo`),
  ADD KEY `Catergoria` (`nombre`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id_cliente`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_hotel` (`id_hotel`),
  ADD KEY `id_habitacion` (`id_habitacion`);

--
-- Indices de la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  ADD PRIMARY KEY (`id_habitacion`),
  ADD KEY `fk_habitacion_hotel` (`id_hotel`);

--
-- Indices de la tabla `historial_pagos`
--
ALTER TABLE `historial_pagos`
  ADD PRIMARY KEY (`id_pago`),
  ADD KEY `id_hotel` (`id_hotel`),
  ADD KEY `id_admin` (`id_admin`);

--
-- Indices de la tabla `hoteles`
--
ALTER TABLE `hoteles`
  ADD PRIMARY KEY (`id_hotel`);

--
-- Indices de la tabla `inf_usuarios`
--
ALTER TABLE `inf_usuarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_cargo` (`id_cargo`),
  ADD KEY `fk_usuario_hotel` (`id_hotel`),
  ADD KEY `fk_usuario_habitacion` (`id_habitacion`),
  ADD KEY `fk_usuario_trabajo` (`id_trabajo`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id_pago`);

--
-- Indices de la tabla `trabajos`
--
ALTER TABLE `trabajos`
  ADD PRIMARY KEY (`id_trabajo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `avisos`
--
ALTER TABLE `avisos`
  MODIFY `id_aviso` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cargo`
--
ALTER TABLE `cargo`
  MODIFY `id_cargo` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id_cliente` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  MODIFY `id_habitacion` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `historial_pagos`
--
ALTER TABLE `historial_pagos`
  MODIFY `id_pago` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `hoteles`
--
ALTER TABLE `hoteles`
  MODIFY `id_hotel` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `inf_usuarios`
--
ALTER TABLE `inf_usuarios`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id_pago` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `trabajos`
--
ALTER TABLE `trabajos`
  MODIFY `id_trabajo` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `avisos`
--
ALTER TABLE `avisos`
  ADD CONSTRAINT `avisos_ibfk_1` FOREIGN KEY (`id_emisor`) REFERENCES `inf_usuarios` (`id`);

--
-- Filtros para la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD CONSTRAINT `clientes_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `inf_usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `clientes_ibfk_2` FOREIGN KEY (`id_hotel`) REFERENCES `hoteles` (`id_hotel`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `clientes_ibfk_3` FOREIGN KEY (`id_habitacion`) REFERENCES `habitaciones` (`id_habitacion`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  ADD CONSTRAINT `fk_habitacion_hotel` FOREIGN KEY (`id_hotel`) REFERENCES `hoteles` (`id_hotel`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `habitaciones_ibfk_1` FOREIGN KEY (`id_hotel`) REFERENCES `hoteles` (`id_hotel`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `historial_pagos`
--
ALTER TABLE `historial_pagos`
  ADD CONSTRAINT `historial_pagos_ibfk_1` FOREIGN KEY (`id_hotel`) REFERENCES `hoteles` (`id_hotel`),
  ADD CONSTRAINT `historial_pagos_ibfk_2` FOREIGN KEY (`id_admin`) REFERENCES `inf_usuarios` (`id`);

--
-- Filtros para la tabla `inf_usuarios`
--
ALTER TABLE `inf_usuarios`
  ADD CONSTRAINT `fk_usuario_habitacion` FOREIGN KEY (`id_habitacion`) REFERENCES `habitaciones` (`id_habitacion`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_usuario_hotel` FOREIGN KEY (`id_hotel`) REFERENCES `hoteles` (`id_hotel`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_usuario_trabajo` FOREIGN KEY (`id_trabajo`) REFERENCES `trabajos` (`id_trabajo`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `inf_usuarios_ibfk_1` FOREIGN KEY (`id_cargo`) REFERENCES `cargo` (`id_cargo`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
