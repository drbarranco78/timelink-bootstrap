<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

use App\Mail\WelcomeMail;


class MailController extends Controller
{
    public function enviarSolicitud(Request $request)
    {
        $nombre = $request->nombre;
        $apellidos = $request->apellidos;
        $dni = $request->dni;
        $email = $request->email; 

        if (!$email) {
            return response()->json(['message' => 'El correo del maestro es inválido.'], 400);
        }        

        Mail::to($email)->send(new WelcomeMail($nombre, $apellidos, $dni));

        return response()->json(['message' => 'Correo enviado correctamente']);

       
    }
}
