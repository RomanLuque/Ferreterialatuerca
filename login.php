<?php
require_once __DIR__ . '/config.php';
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Método no permitido']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) $input = $_POST;

$email    = trim(strtolower($input['email'] ?? ''));
$password = $input['password'] ?? '';

if (!$email || !$password) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'errors' => ['Email y contraseña son obligatorios']]);
    exit;
}

$conn = conectarDB();

$stmt = mysqli_prepare($conn, 'SELECT id, nombre, apellido, email, password_hash, tipo_usuario FROM usuarios WHERE email = ?');
mysqli_stmt_bind_param($stmt, 's', $email);
mysqli_stmt_execute($stmt);
mysqli_stmt_bind_result($stmt, $id, $nombre, $apellido, $email_db, $hash, $tipo_usuario);

if (!mysqli_stmt_fetch($stmt)) {
    mysqli_stmt_close($stmt);
    mysqli_close($conn);
    http_response_code(401);
    echo json_encode(['ok' => false, 'errors' => ['Credenciales inválidas']]);
    exit;
}
mysqli_stmt_close($stmt);
mysqli_close($conn);

if (!password_verify($password, $hash)) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'errors' => ['Credenciales inválidas']]);
    exit;
}

// Login OK → iniciar sesión
session_start();
$_SESSION['usuario'] = [
    'id'           => $id,
    'nombre'       => $nombre,
    'apellido'     => $apellido,
    'email'        => $email_db,
    'tipo_usuario' => $tipo_usuario
];

echo json_encode([
    'ok' => true,
    'message' => 'Login exitoso',
    'usuario' => $_SESSION['usuario']
]);