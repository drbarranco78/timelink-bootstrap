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
        $request->validate([
            'id_usuario' => 'required|exists:usuarios,id|unique:credenciales,id_usuario',
            'password' => 'required|min:8',
        ]);

        $credencial = Credencial::create([
            'id_usuario' => $request->id_usuario,
            'password' => Hash::make($request->password), // Se almacena la contraseña con bcrypt
        ]);

        return response()->json([
            'message' => 'Credencial creada exitosamente',
            'credencial' => $credencial
        ], 201);
    }

    // Obtener una credencial por ID
    public function show($id)
    {
        return Credencial::findOrFail($id);
    }



    // Eliminar una credencial
    public function destroy($id)
    {
        $credencial = Credencial::find($id);

        if (!$credencial) {
            return response()->json(['message' => 'Credencial no encontrada'], 404);
        }

        $credencial->delete();

        return response()->json(['message' => 'Credencial eliminada correctamente'], 200);
    }

    // Actualizar una credencial
    public function cambiarPassword(Request $request)
    {
        // Validación de datos
        $request->validate([
            'id_usuario' => 'required|exists:credenciales,id_usuario',
            'password_actual' => 'required',
            'nuevo_password' => 'required|min:8|different:password_actual',
        ]);

        // Buscar la credencial del usuario
        $credencial = Credencial::where('id_usuario', $request->id_usuario)->first();

        if (!$credencial) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        // Verificar que la contraseña actual sea correcta
        if (!Hash::check($request->password_actual, $credencial->password)) {
            return response()->json(['message' => 'Contraseña actual incorrecta'], 401);
        }

        // Actualizar la contraseña
        $credencial->password = Hash::make($request->nuevo_password);
        $credencial->save();

        return response()->json(['message' => 'Contraseña actualizada correctamente'], 200);
    }
}
