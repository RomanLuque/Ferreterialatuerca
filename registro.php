<?php
require_once __DIR__ . '/config.php';
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Método no permitido']);
    exit;
}

// Recibir JSON o form-data
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) $input = $_POST;

$nombre       = trim($input['nombre'] ?? '');
$apellido     = trim($input['apellido'] ?? '');
$email        = trim(strtolower($input['email'] ?? ''));
$telefono     = trim($input['telefono'] ?? '');
$password     = $input['password'] ?? '';
$password2    = $input['password2'] ?? '';
$tipo_usuario = $input['tipo_usuario'] ?? '';

// Validaciones servidor
$errors = [];
if (!$nombre || !$apellido || !$email || !$telefono || !$password || !$password2 || !$tipo_usuario) {
    $errors[] = 'Todos los campos son obligatorios';
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Email inválido';
}
if ($password !== $password2) {
    $errors[] = 'Las contraseñas no coinciden';
}
if (strlen($password) < 6) {
    $errors[] = 'La contraseña debe tener al menos 6 caracteres';
}
if (!in_array($tipo_usuario, ['cliente', 'mayorista'], true)) {
    $errors[] = 'Tipo de cuenta inválido';
}

if ($errors) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'errors' => $errors]);
    exit;
}

$conn = conectarDB();

// Verificar email único (prepared statement)
$stmt = mysqli_prepare($conn, 'SELECT id FROM usuarios WHERE email = ?');
mysqli_stmt_bind_param($stmt, 's', $email);
mysqli_stmt_execute($stmt);
mysqli_stmt_store_result($stmt);
if (mysqli_stmt_num_rows($stmt) > 0) {
    http_response_code(409);
    echo json_encode(['ok' => false, 'errors' => ['El email ya está registrado']]);
    exit;
}
mysqli_stmt_close($stmt);

// Insertar usuario
$hash = password_hash($password, PASSWORD_BCRYPT);
$stmt = mysqli_prepare($conn, 'INSERT INTO usuarios (nombre, apellido, email, telefono, password_hash, tipo_usuario) VALUES (?, ?, ?, ?, ?, ?)');
mysqli_stmt_bind_param($stmt, 'ssssss', $nombre, $apellido, $email, $telefono, $hash, $tipo_usuario);

if (!mysqli_stmt_execute($stmt)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'errors' => ['Error al registrar: ' . mysqli_stmt_error($stmt)]]);
    exit;
}

$usuario_id = mysqli_insert_id($conn);
if (!$usuario_id) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'errors' => ['No se obtuvo ID de inserción']]);
    exit;
}

mysqli_stmt_close($stmt);
mysqli_close($conn);

echo json_encode([
    'ok' => true,
    'message' => 'Registro exitoso',
    'usuario' => [
        'id' => $usuario_id,
        'nombre' => $nombre,
        'apellido' => $apellido,
        'email' => $email,
        'tipo_usuario' => $tipo_usuario
    ]
]);