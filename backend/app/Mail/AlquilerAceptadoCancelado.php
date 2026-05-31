<?php
namespace App\Mail;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Alquiler;

class AlquilerAceptadoCancelado extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Alquiler $alquiler) {}

    public function envelope(): Envelope
    {
        $asunto = $this->alquiler->estado === 'aceptado'
            ? 'Tu alquiler ha sido aceptado — Antigüedades Mortera'
            : 'Tu alquiler ha sido cancelado — Antigüedades Mortera';
        return new Envelope(subject: $asunto);
    }

    public function content(): Content
    {
        return new Content(view: 'emails.alquiler-aceptado-cancelado');
    }
}