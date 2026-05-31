<?php
namespace App\Mail;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NuevaSolicitudAdmin extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public string $tipo, public object $solicitud) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: "Nueva solicitud de {$this->tipo} — Antigüedades Mortera");
    }

    public function content(): Content
    {
        return new Content(view: 'emails.nueva-solicitud-admin');
    }
}