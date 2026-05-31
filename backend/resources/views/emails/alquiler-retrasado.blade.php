<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Devolución pendiente</title></head>
<body style="font-family: Georgia, serif; color: #1A0D06; max-width: 600px; margin: 0 auto; padding: 2em;">
    <h1 style="color: #5E3023; font-weight: 300; font-style: italic;">Antigüedades Mortera</h1>
    <hr style="border: none; border-top: 1px solid #C08552; margin-bottom: 2em;">
    <p>Hola, <strong>{{ $alquiler->usuario->name }}</strong>.</p>
    <p>El plazo de devolución de tu artículo en alquiler ha vencido hace <strong>{{ $diasRetraso }} {{ $diasRetraso === 1 ? 'día' : 'días' }}</strong>.</p>
    <div style="background: #F3E9DC; padding: 1.5em; margin: 1.5em 0;">
        <p style="margin: 0;"><strong>Producto:</strong> {{ $alquiler->producto->nombre }}</p>
        <p style="margin: 0.5em 0 0;"><strong>Fecha de devolución acordada:</strong> {{ \Carbon\Carbon::parse($alquiler->fecha_devolucion)->format('d/m/Y') }}</p>
    </div>
    <p>Por favor ponte en contacto con nosotros a la mayor brevedad posible en <a href="mailto:antiguedadesmortera@gmail.com" style="color: #5E3023;">antiguedadesmortera@gmail.com</a> o en el teléfono 626 11 15 56.</p>
    <p style="color: #7a5c4a; font-style: italic;">Antigüedades Mortera</p>
</body>
</html>