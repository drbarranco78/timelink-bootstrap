<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

use App\Mail\WelcomeMail;
use App\Mail\InvitacionMail;
use App\Models\Invitacion;


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

    public function enviarInvitacion(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'nombre_empresa' => 'required|string|max:255',
            'id_empresa' => 'required|exists:empresas,id_empresa',
            'reenviar' => 'sometimes|boolean' // false por defecto
        ], [
            'email.required' => 'El campo email es obligatorio',
            'email.email' => 'El formato de email no es válido',
        ]);
        $email = $request-> email;
        $nombre_empresa = $request -> nombre_empresa;
        $id_empresa = $request -> id_empresa;
        $reenviar = $request -> reenviar;
        
        
        // Validar los datos
        if (!$email || !$nombre_empresa || !$id_empresa) {
            return response()->json(['message' => 'Faltan datos para enviar la invitación.'], 400);
        }

        $invitacion_duplicada = Invitacion::where('email', $email)->where('id_empresa', $id_empresa)->first();
        if ($invitacion_duplicada && !$reenviar) {
            return response()->json([
                'message' => 'Este usuario ya tiene una invitación activa. Reenviar la invitación?',
                'showDialog' => true
            ]);
        }
        if ($invitacion_duplicada) {
            $invitacion_duplicada->delete();
        }
        // Crear una invitación
        $invitacion = Invitacion::create([
            'email' => $email,
            'id_empresa' => $id_empresa,
            'fecha_expiracion' => now()->addWeek(), // Expira en una semana
        ]);

        // Crear la URL de invitación
        $invitacion_url = url("/?email={$email}&id_empresa={$id_empresa}&nombre_empresa={$nombre_empresa}");

        // Enviar el correo con la invitación
        Mail::to($email)->send(new InvitacionMail($nombre_empresa, $invitacion_url));

        return response()->json(['message' => 'Invitación enviada correctamente a ' .$email]);
    }

}