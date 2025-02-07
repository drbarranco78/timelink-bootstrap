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
            $request->validate([
                'dni' => 'required|string|unique:users,dni',
                'password' => 'required|string',
                'nombre' => 'required|string|max:50',
                'apellidos' => 'required|string|max:100',
                'email' => 'required|email|unique:users,email',
                'id_empresa' => 'nullable|integer',
                'cargo' => 'required|string|max:50',
                'rol' => 'required|in:maestro,empleado',
                'estado' => 'nullable|in:pendiente,aceptada,rechazada'
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
                'estado' =>$request->estado,
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
        return response()->json(['message' => 'La cuenta de usuario ha sido eliminada']);
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

        return response()->json($usuarios, 200); 
    }


    public function obtenerUsuarioPorId($id)
    {
        $usuario = User::find($id);

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

    public function contarSolicitudesPendientes(Request $request)
    {
        $admin = Auth::user();
        if (!Auth::check()) {
            return response()->json(['message' => 'No autenticado'], 401);
        }
        $idEmpresa = $admin->id_empresa;

        // Obtener los usuarios en estado 'pendiente'
        $pendientes = User::where('id_empresa', $idEmpresa)
                        ->where('estado', 'pendiente')
                        ->get();

        return response()->json(['pendientes' => $pendientes]);
    }

    // Devuelve una lista de empleados con estado 'rechazado'
    public function obtenerEmpleadosInactivos(Request $request) 
    {
        $idEmpresa = $request->input('id_empresa');
    
        if (!$idEmpresa) {
            return response()->json(['message' => 'Falta el parámetro id_empresa'], 400);
        }
    
        $inactivos = User::where('id_empresa', $idEmpresa)
                        ->where('estado', 'rechazada')
                        ->get();
    
        return response()->json(['inactivos' => $inactivos]);
    }
    

    // Cambia el estado de la solicitud de acceso del usuario 
    public function actualizarEstado(Request $request, $id)
    {
        $usuario = User::find($id);

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $estadoAnterior = $usuario->estado;
        $usuario->estado = $request->estado;
        $usuario->save();

        // Definir el mensaje según el nuevo estado
        // $mensaje = "La solicitud de {$usuario->nombre} {$usuario->apellidos} ha sido ";
        // $mensaje .= ($request->estado === 'aceptada') ? "aceptada." : "rechazada.";
        $mensaje="El estado del usuario ha sido actualizado";
        return response()->json(['message' => $mensaje, 'usuario' => $usuario]);
    }

    
    public function registrarEmpleadoConInvitacion(Request $request) {
        // Validación de los campos
        $validated = $request->validate([
            'email' => 'required|email|exists:invitaciones,email',
            'id_empresa' => 'required|exists:empresas,id',
            'dni' => 'required|string|max:20',
            'nombre' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'cargo' => 'required|string|max:255',
            'password' => 'required|string|min:8|confirmed',
        ]);
    
        $email = $request->email;
        $id_empresa = $request->id_empresa;
    
        // Verificar si la invitación existe y no ha expirado
        $invitacion = Invitacion::where('email', $email)
                                ->where('id_empresa', $id_empresa)
                                ->where('fecha_expiracion', '>=', now())
                                ->first();
    
        if (!$invitacion) {
            return response()->json(['message' => 'Invitación no válida o expirada'], 400);
        }
    
        // Crear el usuario
        User::create([
            'email' => $email,
            'id_empresa' => $id_empresa,
            'dni' => $request->dni,
            'nombre' => $request->nombre,
            'apellidos' => $request->apellidos,
            'cargo' => $request->cargo,
            'password' => $request->password,
            'rol' => 'empleado',
            'estado' => 'aceptada',
        ]);
    
        // Eliminar la invitación después de usarse
        $invitacion->delete();
    
        return response()->json(['message' => 'Registro exitoso']);
    }

}