<?php
namespace App\Mail;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Reserva;

class ReservaAceptadaCancelada extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Reserva $reserva) {}

    public function envelope(): Envelope
    {
        $asunto = $this->reserva->estado === 'aceptada'
            ? 'Tu reserva ha sido aceptada — Antigüedades Mortera'
            : 'Tu reserva ha sido cancelada — Antigüedades Mortera';
        return new Envelope(subject: $asunto);
    }

    public function content(): Content
    {
        return new Content(view: 'emails.reserva-aceptada-cancelada');
    }
}