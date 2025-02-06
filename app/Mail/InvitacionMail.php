<?php
namespace App\Mail;

use Illuminate\Mail\Mailable;

class InvitacionMail extends Mailable
{
    public $nombre_empresa;
    public $invitacion_url;

    public function __construct($nombre_empresa, $invitacion_url)
    {
        $this->nombre_empresa = $nombre_empresa;
        $this->invitacion_url = $invitacion_url;
    }

    public function build()
    {
        return $this->view('emails.invitacion')
                    ->with([
                        'nombre_empresa' => $this->nombre_empresa,
                        'invitacion_url' => $this->invitacion_url,
                    ]);
    }
}
