<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

use App\Models\User;
use App\Models\Credencial;

class UserController extends Controller
{
    
    // Obtener todos los usuarios
    public function index()
    {
        return User::all();
    }

    // Crear un nuevo usuario
    public function store(Request $request)
    {
        $request->validate([
            'dni' => 'required|unique:usuarios,dni',
            'nombre' => 'required',
            'apellidos' => 'required',
            'email' => 'required|email|unique:usuarios,email',
            'cif_empresa' => 'required',
            'cargo' => 'required',
            'rol' => 'required|in:maestro,trabajador',
        ]);

        return User::create($request->all());
    }

    // Obtener un usuario por ID
    public function show($id)
    {
        return User::findOrFail($id);
    }

    // Actualizar un usuario
    public function update(Request $request, $id)
    {
        $usuario = User::findOrFail($id);
        $usuario->update($request->all());
        return $usuario;
    }

    // Eliminar un usuario
    public function destroy($id)
    {
        User::destroy($id);
        return response()->json(['message' => 'Usuario eliminado']);
    }

    public function login(Request $request)
    {
        
        // Validar los datos recibidos
        $datos_acceso = $request->validate([
            'dni' => 'required|string',
            'password' => 'required|string',
        ]);

        // Buscar el usuario por DNI
        $usuario = User::where('dni', $request->dni)->first();

        if (!$usuario) {
            return response()->json(['message' => 'DNI no encontrado'], 404);
        }
        // Obtener el ID del usuario
        $idUsuario = $usuario->id;
        // Comprobar la contraseña asociada al ID de usuario
        $credencial = Credencial::where('id_usuario', $idUsuario)->first();

        if (!$credencial || $credencial->password !== $request->password) {
            return response()->json(['message' => 'Contraseña incorrecta'], 401);
        }  
        // if (Session::isStarted()) {
        //     $request->session()->regenerate();
        // } else {
        //     $request->session()->start();
        // }
        Auth::login($usuario);
        
        $redirects = [
            'trabajador' => '/private',
            'maestro' => '/admin',
        ];
    
        return response()->json([
            'message' => 'Inicio de sesión exitoso',
            'usuario' => $usuario,
            'redirect' => $redirects[$usuario->rol] ?? '/',
        ]);

    }

    public function logout(Request $request)
    {
        // Cerrar la sesión del usuario
        Auth::logout();  
        // $request->session()->invalidate();          
        return response()->json(['message' => 'Sesión cerrada correctamente']);
    }
}
