<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

if (isset($_SESSION['usuario'])) {
    echo json_encode(['ok' => true, 'usuario' => $_SESSION['usuario']]);
} else {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'No autenticado']);
}