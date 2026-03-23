<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Sora:wght@400;600;700&display=swap" rel="stylesheet">
    <title>SecureMap | Iniciar sesión</title>
    @vite(['resources/css/app.css'])
</head>
<body class="auth-shell">
<div class="ambient-bg"></div>
<main class="auth-card reveal">
    <h1>SecureMap</h1>
    <p class="subtitle">Accede para gestionar marcadores geográficos en tiempo real.</p>

    @if ($errors->any())
        <div class="notice error">
            {{ $errors->first() }}
        </div>
    @endif

    <form method="POST" action="{{ route('login.attempt') }}" class="auth-form">
        @csrf
        <label>
            Correo
            <input type="email" name="email" value="{{ old('email') }}" required autocomplete="email">
        </label>

        <label>
            Contraseña
            <input type="password" name="password" required autocomplete="current-password">
        </label>

        <label class="remember-line">
            <input type="checkbox" name="remember" value="1">
            Mantener sesión activa
        </label>

        <button type="submit">Entrar</button>
    </form>

    <p class="muted">¿No tienes cuenta? <a href="{{ route('register.form') }}">Regístrate aquí</a>.</p>
</main>
</body>
</html>
