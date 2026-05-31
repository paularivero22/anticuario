<?php
namespace App\Mail;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Alquiler;

class AlquilerCompletado extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Alquiler $alquiler) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Gracias por su alquiler — Antigüedades Mortera');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.alquiler-completado');
    }
}