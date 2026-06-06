<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Cliente retrasado en devolución</title></head>
<body style="font-family: Georgia, serif; color: #1A0D06; max-width: 600px; margin: 0 auto; padding: 2em;">
    <h1 style="color: #5E3023; font-weight: 300; font-style: italic;">Antigüedades Mortera</h1>
    <hr style="border: none; border-top: 1px solid #C08552; margin-bottom: 2em;">
    <p>Un cliente se ha retrasado en la devolución de un alquiler.</p>
    <div style="background: #F3E9DC; padding: 1.5em; margin: 1.5em 0;">
        <p style="margin: 0;"><strong>Cliente:</strong> {{ $alquiler->usuario->name }} ({{ $alquiler->usuario->email }})</p>
        <p style="margin: 0.5em 0 0;"><strong>Producto:</strong> {{ $alquiler->producto->nombre }}</p>
        <p style="margin: 0.5em 0 0;"><strong>Fecha de devolución:</strong> {{ \Carbon\Carbon::parse($alquiler->fecha_devolucion)->format('d/m/Y') }}</p>
        <p style="margin: 0.5em 0 0;"><strong>Días de retraso:</strong> {{ $diasRetraso }}</p>
    </div>
    <p style="color: #7a5c4a; font-style: italic;">Antigüedades Mortera</p>
</body>
</html>