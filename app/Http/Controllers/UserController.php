<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;


use App\Models\User;
use App\Models\Credencial;
use App\Models\Empresa;

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
            $validator = Validator::make($request->all(), [
                'dni' => 'required|string|unique:users,dni',
                'password' => 'required|string',
                'nombre' => 'required|string|max:50',
                'apellidos' => 'required|string|max:100',
                'email' => 'required|email|unique:users,email',
                'id_empresa' => 'nullable|integer',
                'cargo' => 'required|string|max:50',
                'rol' => 'required|in:maestro,empleado',
            ], [
                'dni.unique' => 'El DNI ya está registrado.',
                'email.unique' => 'El email ya está registrado.',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'error' => $validator->errors()->first() 
                ], 422);
            }

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
    // public function update(Request $request, $id)
    // {
    //     $usuario = User::findOrFail($id);
    //     $usuario->update($request->all());
    //     return $usuario;
    // }

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

        // Cargar la empresa asociada al usuario
        $empresa = Empresa::where('id_empresa', $usuario->id_empresa)->first();
        
        $redirects = [
            'empleado' => '/private',
            'maestro' => '/admin',
        ];
    
        return response()->json([
            'message' => 'Inicio de sesión exitoso',
            'usuario' => $usuario,
            'empresa' => $empresa,
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
    public function obtenerUsuariosPorEmpresa($idEmpresa) 
    {
        $usuarios = User::where('id_empresa', $idEmpresa)->get();

        // Verificar si hay usuarios en esa empresa
        if ($usuarios->isEmpty()) {
            return response()->json([
                'message' => 'No hay usuarios registrados en esta empresa.'
            ], 404);
        }

        return response()->json($usuarios);        
    }

    public function obtenerUsuarioPorId($idUsuario)
    {
        $usuario = User::where('id', $idUsuario)->first();

        if (!$usuario) {
            return response()->json(['mensaje' => 'Usuario no encontrado'], 404);
        }

        return response()->json($usuario);
    }

    public function update(Request $request)
    {

        // Validar los datos recibidos
        $request->validate([
            'id' => 'required|exists:users,id',
            'nombre' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'dni' => 'required|string|max:20',
            'email' => 'required|email|unique:users,email,' . $request->id . '|max:255',
            'cargo' => 'required|string|max:255',
        ], [
            'email.email' => 'El formato de email no es válido',
            'id.exists' => 'El usuario no existe en la base de datos'   
        ]);

        // Buscar el empleado por el ID
        
        $empleado = User::find($request->id);

        if (!$empleado) {
            return response()->json(['message' => 'Empleado no encontrado'], 404);
        }

        // Asignar nuevos valores
        $empleado->nombre = $request->input('nombre');
        $empleado->apellidos = $request->input('apellidos');
        $empleado->dni = $request->input('dni');
        $empleado->email = $request->input('email');
        $empleado->cargo = $request->input('cargo');
        

        // Guardar los cambios
        $empleado->save();

        return response()->json(['message' => 'Empleado actualizado con éxito']);
    }



}