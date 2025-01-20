<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

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
            'id_usuario' => 'required|exists:usuario,id_usuario',
            'password' => 'required',
        ]);

        return Credencial::create($request->all());
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
