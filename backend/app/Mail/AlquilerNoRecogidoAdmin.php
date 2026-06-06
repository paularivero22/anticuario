<?php
namespace App\Mail;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Alquiler;
class AlquilerNoRecogidoAdmin extends Mailable
{
    use Queueable, SerializesModels;
    public function __construct(public Alquiler $alquiler) {}
    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Alquiler no recogido — Antigüedades Mortera');
    }
    public function content(): Content
    {
        return new Content(view: 'emails.alquiler-no-recogido-admin');
    }
}