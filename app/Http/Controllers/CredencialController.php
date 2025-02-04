<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Credencial;

class CredencialController extends Controller
{
    // Obtener todas las credenciales
    public function index()
    {
        return Credencial::all();
    }

    // Crear una nueva credencial
    public function store(Request $request)
    {
        // TODO: Implementar Bcrypt para almacenar contraseñas
        $request->validate([
            'id_usuario' => 'required|exists:usuarios,id',
            'password' => 'required',
        ]);

        $credencial = Credencial::create([
            'id_usuario' => $request->id_usuario,
            'password' => $request->password, 
        ]);

        return response()->json($credencial, 201);
    }

    // Obtener una credencial por ID
    public function show($id)
    {
        return Credencial::findOrFail($id);
    }

    // Actualizar una credencial
    // public function update(Request $request, $id)
    // {
    //     $credencial = Credencial::findOrFail($id);
    //     $credencial->update($request->all());
    //     return $credencial;
    // }

    // Eliminar una credencial
    public function destroy($id)
    {
        Credencial::destroy($id);
        return response()->json(['message' => 'Credencial eliminada']);
    }

    public function cambiarPassword(Request $request)
    {
        // Validación de datos
        $request->validate([
            'id_usuario' => 'required|exists:credenciales,id_usuario',
            'password_actual' => 'required',
            'nuevo_password' => 'required'
        ]);

        // Buscar la credencial del usuario
        $credencial = Credencial::where('id_usuario', $request->id_usuario)->first();

        if (!$credencial) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        if ($request->password_actual !== $credencial->password) {
            return response()->json(['message' => 'Contraseña actual incorrecta'], 401);
        }        

        // Actualizar la contraseña 
        $credencial->password = $request->nuevo_password;
        $credencial->save();

        return response()->json(['message' => 'Contraseña actualizada correctamente']);
    }
}
