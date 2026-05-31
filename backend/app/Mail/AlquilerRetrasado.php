<?php
namespace App\Mail;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Alquiler;

class AlquilerRetrasado extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Alquiler $alquiler, public int $diasRetraso) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Devolución pendiente — Antigüedades Mortera');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.alquiler-retrasado');
    }
}