<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\DB;

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
        $redirects = [
            'empleado' => '/private',
            'maestro' => '/admin',
        ];

        try {
            $request->validate([
                'dni' => 'required|string|unique:usuarios,dni',
                'password' => 'required|string',
                'nombre' => 'required|string|max:50',
                'apellidos' => 'required|string|max:100',
                'email' => 'required|email|unique:usuarios,email',
                'id_empresa' => 'nullable|integer',
                'cargo' => 'required|string|max:50',
                'rol' => 'required|in:maestro,empleado',
            ], [
                'dni.unique' => 'El DNI ya está registrado.',
                'email.unique' => 'El email ya está registrado.',
            ]);

            DB::beginTransaction();

            // Crear el usuario en la tabla usuarios
            $usuario = User::create([
                'dni' => $request->dni,
                'nombre' => $request->nombre,
                'apellidos' => $request->apellidos,
                'email' => $request->email,
                'id_empresa' => $request->id_empresa,
                'cargo' => $request->cargo,
                'rol' => $request->rol,
            ]);

            // Crear la entrada en la tabla credenciales
            DB::table('credenciales')->insert([
                'id_usuario' => $usuario->id,
                'password' => $request->password,
            ]);

            DB::commit();

            Auth::login($usuario);

            return response()->json([
                'message' => 'Usuario registrado correctamente',
                'redirect' => $redirects[$usuario->rol] ?? '/',
                'usuario' => $usuario,
            ], 201);

        } catch (\Illuminate\Database\QueryException $e) {
            // Si el error es una violación de clave única (DNI o email duplicado)
            if ($e->getCode() == '23000') {  
                return response()->json([
                    'error' => 'El DNI o el email ya están registrados.',
                ], 422);  
            }    
            
            return response()->json([
                'error' => 'Error de base de datos: ' . $e->getMessage(),
            ], 500);
        } catch (\Exception $e) {
           
            return response()->json([
                'error' => 'Error al registrar usuario: ' . $e->getMessage(),
            ], 500);
        }
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
            'empleado' => '/private',
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

    public function obtenerEmailMaestro($idEmpresa)
    {
        // Busca el usuario con rol "maestro" asociado a la empresa
        $maestro = DB::table('users')
            ->where('id_empresa', $idEmpresa)
            ->where('rol', 'maestro')
            ->first();

        if ($maestro) {
            return response()->json(['email' => $maestro->email]);
        } else {
            return response()->json(['message' => 'No se encontró un usuario maestro para esta empresa.'], 404);
        }
    }
}
