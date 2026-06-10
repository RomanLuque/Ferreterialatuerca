<?php
// config.php — Conexión mysqli procedural
function conectarDB() {
    $servidor     = "localhost";
    $usuario      = "root";
    $contrasenia  = "";
    $baseDeDatos  = "ferreteria";

    $conexion = mysqli_connect($servidor, $usuario, $contrasenia, $baseDeDatos);

    mysqli_set_charset($conexion, "utf8mb4");

    if (!$conexion) {
        die("❌ Error de conexión: " . mysqli_connect_error());
    }

    return $conexion;
}