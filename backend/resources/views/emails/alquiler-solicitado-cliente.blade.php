<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Alquiler solicitado</title></head>
<body style="font-family: Georgia, serif; color: #1A0D06; max-width: 600px; margin: 0 auto; padding: 2em;">
    <h1 style="color: #5E3023; font-weight: 300; font-style: italic;">Antigüedades Mortera</h1>
    <hr style="border: none; border-top: 1px solid #C08552; margin-bottom: 2em;">
    <p>Hola, <strong>{{ $alquiler->usuario->name }}</strong>.</p>
    <p>Hemos recibido tu solicitud de alquiler para el siguiente artículo:</p>
    <div style="background: #F3E9DC; padding: 1.5em; margin: 1.5em 0;">
        <p style="margin: 0;"><strong>Producto:</strong> {{ $alquiler->producto->nombre }}</p>
        @if($alquiler->fecha_recogida)
        <p style="margin: 0.5em 0 0;"><strong>Fecha de recogida:</strong> {{ \Carbon\Carbon::parse($alquiler->fecha_recogida)->format('d/m/Y') }}</p>
        @endif
        @if($alquiler->fecha_devolucion)
        <p style="margin: 0.5em 0 0;"><strong>Fecha de devolución:</strong> {{ \Carbon\Carbon::parse($alquiler->fecha_devolucion)->format('d/m/Y') }}</p>
        @endif
    </div>
    <p>Nos pondremos en contacto contigo para confirmarlo.</p>
    <p style="color: #7a5c4a; font-style: italic;">Antigüedades Mortera</p>
</body>
</html>