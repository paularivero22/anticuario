<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Cancelación</title></head>
<body style="font-family: Georgia, serif; color: #1A0D06; max-width: 600px; margin: 0 auto; padding: 2em;">
    <h1 style="color: #5E3023; font-weight: 300; font-style: italic;">Antigüedades Mortera — Panel Admin</h1>
    <hr style="border: none; border-top: 1px solid #C08552; margin-bottom: 2em;">
    <p>Un cliente ha cancelado su <strong>{{ $tipo }}</strong>.</p>
    <div style="background: #F3E9DC; padding: 1.5em; margin: 1.5em 0;">
        <p style="margin: 0;"><strong>Cliente:</strong> {{ $solicitud->usuario->name }} ({{ $solicitud->usuario->email }})</p>
        <p style="margin: 0.5em 0 0;"><strong>Producto:</strong> {{ $solicitud->producto->nombre }}</p>
    </div>
    <p>El producto ha vuelto a estar disponible automáticamente.</p>
</body>
</html>