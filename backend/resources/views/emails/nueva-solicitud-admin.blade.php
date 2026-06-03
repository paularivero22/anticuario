<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Nueva solicitud</title></head>

<body style="font-family: Georgia, serif; color: #1A0D06; max-width: 600px; margin: 0 auto; padding: 2em;">
    <h1 style="color: #5E3023; font-weight: 300; font-style: italic;">Antigüedades Mortera — Panel Admin</h1>
    <hr style="border: none; border-top: 1px solid #C08552; margin-bottom: 2em;">
    <p>Se ha recibido una nueva solicitud de <strong>{{ $tipo }}</strong>.</p>
    <div style="background: #F3E9DC; padding: 1.5em; margin: 1.5em 0;">
        <p style="margin: 0;"><strong>Cliente:</strong> {{ $solicitud->usuario->name }} ({{ $solicitud->usuario->email }})</p>
        <p style="margin: 0.5em 0 0;"><strong>Producto:</strong> {{ $solicitud->producto->nombre }}</p>
        @if(isset($solicitud->fecha_recogida) && $solicitud->fecha_recogida)
        <p style="margin: 0.5em 0 0;"><strong>Fecha de recogida:</strong> {{ \Carbon\Carbon::parse($solicitud->fecha_recogida)->format('d/m/Y') }}</p>
        @endif
        @if(isset($solicitud->fecha_devolucion) && $solicitud->fecha_devolucion)
        <p style="margin: 0.5em 0 0;"><strong>Fecha de devolución:</strong> {{ \Carbon\Carbon::parse($solicitud->fecha_devolucion)->format('d/m/Y') }}</p>
        @endif
    </div>
    <p>Accede al panel de administración para gestionarla.</p>
</body>
</html>