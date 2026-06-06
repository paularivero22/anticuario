<?php
namespace App\Mail;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Reserva;
class ReservaNoRecogidaAdmin extends Mailable
{
    use Queueable, SerializesModels;
    public function __construct(public Reserva $reserva) {}
    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Reserva no recogida — Antigüedades Mortera');
    }
    public function content(): Content
    {
        return new Content(view: 'emails.reserva-no-recogida-admin');
    }
}