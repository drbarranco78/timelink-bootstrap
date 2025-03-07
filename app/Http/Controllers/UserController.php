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
    
        $request->validate([
            // 'dni' => ['required', 'string', 'unique:users,dni', new DniNieValido], Comentado para pruebas (Usar en producción)
            'dni' => 'required|string|unique:users,dni|regex:/^\d{8}[A-Z]$/', // Validación básica para desarrollo
            'password' => 'required|string|min:8|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/',
            'nombre' => 'required|string|max:50|regex:/^[A-Za-zñÑáéíóúÁÉÍÓÚ]+(?:\s[A-Za-zñÑáéíóúÁÉÍÓÚ]+)*$/',
            'apellidos' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email|regex:/^[a-zA-Z0-9._%+-]{1,40}@[a-zA-Z0-9.-]{2,20}\.[a-zA-Z]{2,}$/',
            'id_empresa' => 'nullable|exists:empresas,id_empresa',
            'cargo' => 'required|string|max:50',
            'rol' => 'required|in:maestro,empleado',
            'estado' => 'nullable|in:pendiente,aceptada,rechazada,baja,vacaciones'
        ], [
            'dni.unique' => 'El DNI ya está registrado.',
            'email.unique' => 'El email ya está registrado.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'id_empresa.exists' => 'La empresa seleccionada no es válida.',
            'estado.in' => 'El estado debe ser pendiente, aceptada, rechazada, baja o vacaciones',
        ]);
    
        try {
            DB::beginTransaction();
    
            // Crear usuario en la tabla `users`
            $usuario = User::create([
                'dni' => $request->dni,
                'nombre' => $request->nombre,
                'apellidos' => $request->apellidos,
                'email' => $request->email,
                'id_empresa' => $request->id_empresa,
                'cargo' => $request->cargo,
                'rol' => $request->rol,
                'estado' => $request->estado,
            ]);
    
            // Crea la credencial en la tabla 'credenciales' con la contraseña encriptada
            Credencial::create([
                'id_usuario' => $usuario->id,
                'password' => Hash::make($request->password),
            ]);
    
            DB::commit();
    
            Auth::login($usuario);
            $mensaje = ($request->estado ?? '') === 'pendiente' ? 'Solicitud enviada al administrador de la empresa': 'Usuario registrado correctamente';
    
            return response()->json([
                'message' => $mensaje,
                'redirect' => $redirects[$usuario->rol] ?? '/',
                'usuario' => $usuario,
            ], 201);
    
        } catch (\Exception $e) {
            DB::rollBack(); 
    
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
            'dni' => 'required|string|regex:/^\d{8}[A-Z]$/',
            'password' => 'required|string|min:8',
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
        if (!$credencial || !Hash::check($request->password, $credencial->password)) {
            return response()->json(['message' => 'Contraseña incorrecta'], 401);
        }

        // Descomentar en producción para almacenar sesiones

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
    
    public function obtenerUsuariosPorEmpresa($idEmpresa, Request $request)
    {
        $fecha = $request->query('fecha', now()->toDateString());
        $usuarios = User::where('id_empresa', $idEmpresa)
            ->whereDate('created_at', '<=', $fecha)
            ->get();

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
            'nombre' => 'required|string|max:50|regex:/^[A-Za-zñÑáéíóúÁÉÍÓÚ]+(?:\s[A-Za-zñÑáéíóúÁÉÍÓÚ]+)*$/',
            'apellidos' => 'required|string|max:50|regex:/^(?=[A-Za-zñÑáéíóúÁÉÍÓÚ])[A-Za-zñÑáéíóúÁÉÍÓÚ\s]{1,48}[A-Za-zñÑáéíóúÁÉÍÓÚ]$/',
            // 'dni' => ['required', 'string', 'unique:users,dni', new DniNieValido],
            'dni' => 'required|string|max:20',
            'email' => 'required|email|unique:users,email,' . $request->id . '|max:255',
            'cargo' => 'required|string|max:255',
            'estado' => 'sometimes|in:pendiente,aceptada,rechazada,baja,vacaciones',
        ], [             
            //'dni.regex' => 'El formato del DNI no es válido',
            'nombre.regex' => 'El nombre solo puede contener letras y espacios.',
            'apellidos.regex' => 'Los apellidos solo pueden contener letras y espacios.',
            'email.email' => 'El formato de email no es válido',
            'id.exists' => 'El usuario no existe en la base de datos',
            'estado.in' => 'El estado debe ser pendiente, aceptada, rechazada, baja o vacaciones',
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
        if ($request->has('estado')) {
            $empleado->estado = $request->input('estado');
        }  
        
        // Guardar los cambios
        $empleado->save();
        return response()->json(['message' => 'Empleado actualizado con éxito']);
    }

    // Devuelve una lista de empleados con solicitudes de acceso pendiantes de aprobación
    public function contarSolicitudesPendientes(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'No autenticado'], 401);
        }
        $admin = Auth::user();
        
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
        $request->validate([
            'id_empresa' => 'required|exists:empresas,id_empresa',
        ]);
        $idEmpresa=$request->input('id_empresa');
    
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
        // Validar la entrada
        $request->validate([
            'estado' => 'required|string|in:pendiente,aceptada,rechazada,baja,vacaciones',
        ], [
            'estado.in' => 'El estado debe ser pendiente, aceptada, rechazada, baja o vacaciones',
        ]);

        // Buscar el usuario
        $usuario = User::find($id);
        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        // Verificar si el usuario autenticado tiene permisos (puedes mejorar esta lógica)
        // if (!Auth::user()->esAdmin()) {
        //     return response()->json(['message' => 'No tienes permisos para realizar esta acción'], 403);
        // }

        // Evitar actualizaciones innecesarias
        if ($usuario->estado === $request->estado) {
            return response()->json(['message' => 'El usuario ya tiene este estado'], 200);
        }

        // Guardar el nuevo estado
        $estadoAnterior = $usuario->estado;
        $usuario->estado = $request->estado;
        $usuario->save();

     

        return response()->json([
            'message' => 'El estado del usuario ha sido actualizado',
            'usuario' => $usuario
        ]);
    }


    // Registra a un empleado invitado 
    public function registrarEmpleadoConInvitacion(Request $request) {
        // Validación de los campos
        $validated = $request->validate([
            'email' => 'required|email|exists:invitaciones,email|unique:users,email',
            'id_empresa' => 'required|exists:empresas,id',
            'dni' => ['required', 'string', 'max:20', 'unique:users,dni', new DniNieValido],
            'nombre' => 'required|string|max:50|regex:/^[A-Za-zñÑáéíóúÁÉÍÓÚ]+(?:\s[A-Za-zñÑáéíóúÁÉÍÓÚ]+)*$/',
            'apellidos' => 'required|string|max:50|regex:/^(?=[A-Za-zñÑáéíóúÁÉÍÓÚ])[A-Za-zñÑáéíóúÁÉÍÓÚ\s]{1,48}[A-Za-zñÑáéíóúÁÉÍÓÚ]$/',
            'cargo' => 'required|string|max:255|regex:/^[\pL\s]+$/u',
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/'
            ],
        ], [
            'dni.unique' => 'El DNI ya está registrado.',
            'email.unique' => 'El email ya está registrado.',
            'nombre.regex' => 'El nombre solo puede contener letras y espacios.',
            'apellidos.regex' => 'Los apellidos solo pueden contener letras y espacios.',
            'cargo.regex' => 'El cargo solo puede contener letras y espacios.',
            'password.regex' => 'La contraseña debe tener al menos una letra y un número.',
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
            'password' => bcrypt($request->password), // Encriptar la contraseña
            'rol' => 'empleado',
            'estado' => 'aceptada',
        ]);
    
        // Eliminar la invitación después de usarse
        $invitacion->delete();
    
        return response()->json(['message' => 'Registro exitoso']);
    }

}