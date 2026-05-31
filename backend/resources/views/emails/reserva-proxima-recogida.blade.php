<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Recordatorio de recogida</title></head>
<body style="font-family: Georgia, serif; color: #1A0D06; max-width: 600px; margin: 0 auto; padding: 2em;">
    <h1 style="color: #5E3023; font-weight: 300; font-style: italic;">Antigüedades Mortera</h1>
    <hr style="border: none; border-top: 1px solid #C08552; margin-bottom: 2em;">
    <p>Hola, <strong>{{ $reserva->usuario->name }}</strong>.</p>
    <p>Te recordamos que mañana es el día acordado para recoger tu pedido:</p>
    <div style="background: #F3E9DC; padding: 1.5em; margin: 1.5em 0;">
        <p style="margin: 0;"><strong>Producto:</strong> {{ $reserva->producto->nombre }}</p>
        <p style="margin: 0.5em 0 0;"><strong>Fecha de recogida:</strong> {{ \Carbon\Carbon::parse($reserva->fecha_recogida)->format('d/m/Y') }}</p>
    </div>
    <p>Si necesitas cambiar la fecha contacta con nosotros en <a href="mailto:antiguedadesmortera@gmail.com" style="color: #5E3023;">antiguedadesmortera@gmail.com</a>.</p>
    <p style="color: #7a5c4a; font-style: italic;">Antigüedades Mortera</p>
</body>
</html>