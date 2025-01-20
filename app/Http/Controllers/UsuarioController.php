<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UsuarioController extends Controller
{
    // Obtener todos los usuarios
    public function index()
    {
        return Usuario::all();
    }

    // Crear un nuevo usuario
    public function store(Request $request)
    {
        $request->validate([
            'dni' => 'required|unique:usuario,dni',
            'nombre' => 'required',
            'apellidos' => 'required',
            'email' => 'required|email|unique:usuario,email',
            'cif_empresa' => 'required',
            'cargo' => 'required',
            'rol' => 'required|in:maestro,trabajador',
        ]);

        return Usuario::create($request->all());
    }

    // Obtener un usuario por ID
    public function show($id)
    {
        return Usuario::findOrFail($id);
    }

    // Actualizar un usuario
    public function update(Request $request, $id)
    {
        $usuario = Usuario::findOrFail($id);
        $usuario->update($request->all());
        return $usuario;
    }

    // Eliminar un usuario
    public function destroy($id)
    {
        Usuario::destroy($id);
        return response()->json(['message' => 'Usuario eliminado']);
    }
}
