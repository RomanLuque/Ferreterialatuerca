<?php
session_start();
if (!isset($_SESSION['usuario'])) {
    header('Location: login_ferreteria.html');
    exit;
}
$u = $_SESSION['usuario'];
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Dashboard - Ferreteria la tuerca</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <main class="main" style="padding-top: 120px;">
    <div class="login-card" style="max-width: 600px;">
      <div class="form-panel" style="padding: 40px; text-align: center;">
        <h1 style="font-family: var(--font-display); color: var(--clr-text); margin-bottom: 1rem;">
          Bienvenido, <?= htmlspecialchars($u['nombre']) ?>
        </h1>
        <p style="color: var(--clr-muted); margin-bottom: 2rem;">
          Email: <?= htmlspecialchars($u['email']) ?><br>
          Tipo: <?= $u['tipo_usuario'] === 'mayorista' ? '🏢 Mayorista' : '👤 Cliente' ?>
        </p>
        <a href="logout.php" class="btn btn-secondary">Cerrar sesión</a>
      </div>
    </div>
  </main>
</body>
</html>