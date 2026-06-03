<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Estado de tu alquiler</title></head>

<body style="font-family: Georgia, serif; color: #1A0D06; max-width: 600px; margin: 0 auto; padding: 2em;">
    <h1 style="color: #5E3023; font-weight: 300; font-style: italic;">Antigüedades Mortera</h1>
    <hr style="border: none; border-top: 1px solid #C08552; margin-bottom: 2em;">
    <p>Hola, <strong>{{ $alquiler->usuario->name }}</strong>.</p>
    @if($alquiler->estado === 'aceptado')
        <p>Nos complace informarte de que tu alquiler ha sido <strong>aceptado</strong>.</p>
        <div style="background: #F3E9DC; padding: 1.5em; margin: 1.5em 0;">
            <p style="margin: 0;"><strong>Producto:</strong> {{ $alquiler->producto->nombre }}</p>
            @if($alquiler->fecha_recogida)
            <p style="margin: 0.5em 0 0;"><strong>Fecha de recogida:</strong> {{ \Carbon\Carbon::parse($alquiler->fecha_recogida)->format('d/m/Y') }}</p>
            @endif
            @if($alquiler->fecha_devolucion)
            <p style="margin: 0.5em 0 0;"><strong>Fecha de devolución:</strong> {{ \Carbon\Carbon::parse($alquiler->fecha_devolucion)->format('d/m/Y') }}</p>
            @endif
        </div>
        <p>Te esperamos en nuestra tienda en la fecha indicada.</p>
    @else
        <p>Lamentablemente tu alquiler ha sido <strong>cancelado</strong>.</p>
        <div style="background: #F3E9DC; padding: 1.5em; margin: 1.5em 0;">
            <p style="margin: 0;"><strong>Producto:</strong> {{ $alquiler->producto->nombre }}</p>
        </div>
        <p>Si tienes alguna duda puedes contactarnos en <a href="mailto:antiguedadesmortera@gmail.com" style="color: #5E3023;">antiguedadesmortera@gmail.com</a>.</p>
    @endif
    <p style="color: #7a5c4a; font-style: italic;">Antigüedades Mortera</p>
</body>
</html>