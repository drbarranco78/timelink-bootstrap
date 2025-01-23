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
    public function update(Request $request, $id)
    {
        $credencial = Credencial::findOrFail($id);
        $credencial->update($request->all());
        return $credencial;
    }

    // Eliminar una credencial
    public function destroy($id)
    {
        Credencial::destroy($id);
        return response()->json(['message' => 'Credencial eliminada']);
    }
}
