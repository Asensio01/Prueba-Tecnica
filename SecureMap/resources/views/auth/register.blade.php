<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Sora:wght@400;600;700&display=swap" rel="stylesheet">
    <title>SecureMap | Registro</title>
    @vite(['resources/css/app.css'])
</head>
<body class="auth-shell">
<div class="ambient-bg"></div>
<main class="auth-card reveal">
    <h1>Crear cuenta</h1>
    <p class="subtitle">Tu panel para marcar puntos críticos en el mapa.</p>

    @if ($errors->any())
        <div class="notice error">
            {{ $errors->first() }}
        </div>
    @endif

    <form method="POST" action="{{ route('register.attempt') }}" class="auth-form">
        @csrf
        <label>
            Nombre
            <input type="text" name="name" value="{{ old('name') }}" required autocomplete="name">
        </label>

        <label>
            Correo
            <input type="email" name="email" value="{{ old('email') }}" required autocomplete="email">
        </label>

        <label>
            Contraseña
            <input type="password" name="password" required autocomplete="new-password">
        </label>

        <label>
            Confirmar contraseña
            <input type="password" name="password_confirmation" required autocomplete="new-password">
        </label>

        <button type="submit">Crear cuenta</button>
    </form>

    <p class="muted">¿Ya tienes cuenta? <a href="{{ route('login') }}">Inicia sesión</a>.</p>
</main>
</body>
</html>
