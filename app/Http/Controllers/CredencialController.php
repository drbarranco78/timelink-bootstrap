<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Credencial;
use Illuminate\Support\Facades\Hash;
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
            'id_usuario' => 'required|integer|exists:usuarios,id|unique:credenciales,id_usuario',
            'password' => [
                'required',
                'string',
                'min:8',
                'max:20',
                'regex:/^(?=.*[A-Za-z])(?=.*\d).{8,}$/',
            ],
        ], [
            'id_usuario.required' => 'El ID de usuario es obligatorio.',
            'id_usuario.integer' => 'El ID de usuario debe ser un número entero.',
            'id_usuario.exists' => 'El usuario no existe en la base de datos.',
            'id_usuario.unique' => 'Este usuario ya tiene credenciales asignadas.',
        
            'password.required' => 'La contraseña es obligatoria.',
            'password.string' => 'La contraseña debe ser un texto válido.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'password.max' => 'La contraseña no puede superar los 20 caracteres.',
            'password.regex' => 'La contraseña debe contener al menos una letra y un número.',
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
            'password_actual' => 'required|string',
            'nuevo_password' => [
                'required',
                'string',
                'min:8',
                'max:50',
                'different:password_actual',
                'regex:/^(?=.*[A-Za-z])(?=.*\d).{8,}$/',
            ],
        ], [
            'id_usuario.required' => 'El ID de usuario es obligatorio.',
            'id_usuario.exists' => 'El usuario no tiene credenciales registradas.',
    
            'password_actual.required' => 'Debes ingresar tu contraseña actual.',
            'password_actual.string' => 'La contraseña actual debe ser un texto válido.',
    
            'nuevo_password.required' => 'Debes ingresar una nueva contraseña.',
            'nuevo_password.string' => 'La nueva contraseña debe ser un texto válido.',
            'nuevo_password.min' => 'La nueva contraseña debe tener al menos 8 caracteres.',
            'nuevo_password.max' => 'La nueva contraseña no puede superar los 50 caracteres.',
            'nuevo_password.different' => 'La nueva contraseña debe ser diferente de la actual.',
            'nuevo_password.regex' => 'La nueva contraseña debe contener al menos una letra y un número.',
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
