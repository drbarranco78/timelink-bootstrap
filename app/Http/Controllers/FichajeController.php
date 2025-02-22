<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Fichaje;
use App\Models\User;
use Illuminate\Support\Facades\Log;
//use Illuminate\Support\Carbon;
use Carbon\Carbon;

class FichajeController extends Controller
{
    // Obtener todos los fichajes
    public function index()
    {
        return Fichaje::all();
    }

    // Crear un nuevo fichaje
    public function store(Request $request)
    {
        $request->validate([
            'id_usuario' => 'required|exists:users,id',
            'tipo_fichaje' => 'required|in:entrada,salida,inicio_descanso,fin_descanso,registro',
            'fecha' => 'required|date',
            'hora' => 'required|date_format:H:i:s',
            'ubicacion' => 'nullable|string',
            'ciudad' => 'nullable|string|max:100',
            'latitud' => 'nullable|numeric|between:-90,90', 
            'longitud' => 'nullable|numeric|between:-180,180', 
            'comentarios' => 'nullable|string|max:255'
        ]);

        try {
            $idUsuario = $request->id_usuario;
            $tipoFichaje = $request->tipo_fichaje;
            $fecha = $request->fecha;
            $hora = $request->hora;
            $ubicacion = $request->ubicacion;
            $ciudad = $request->ciudad;
            $latitud = $request->latitud;
            $longitud = $request->longitud;
            $comentarios = $request->comentarios;
            $duracion = 0;

            if ($tipoFichaje === 'inicio_descanso' || $tipoFichaje === 'salida') {
                // Buscar el fichaje de entrada para el día
                $entradaFichaje = Fichaje::where('id_usuario', $idUsuario)
                    ->whereDate('fecha', $fecha)
                    ->where('tipo_fichaje', 'entrada')
                    ->orderBy('hora', 'desc')
                    ->first();
            
                if ($entradaFichaje) {
                    // Convertir la hora de entrada y la hora actual a objetos Carbon
                    $horaEntrada = Carbon::createFromFormat('H:i:s', $entradaFichaje->hora);
                    $horaActualObj = Carbon::createFromFormat('H:i:s', $hora); // $hora ya debe venir con segundos (por ejemplo, "12:00:00")
                    
                    // Calcular el tiempo total transcurrido desde la entrada hasta ahora
                    $tiempoTotal = $horaEntrada->diffInSeconds($horaActualObj);
                    
                    // Sumar el tiempo de descansos ya registrados (almacenados en fichajes de tipo fin_descanso)
                    $tiempoBreaks = Fichaje::where('id_usuario', $idUsuario)
                        ->whereDate('fecha', $fecha)
                        ->where('tipo_fichaje', 'fin_descanso')
                        ->sum('duracion');
                    
                    // El tiempo trabajado acumulado es la diferencia total menos el tiempo en descansos
                    $trabajoAcumulado = $tiempoTotal - $tiempoBreaks;
                    
                    Log::info("Tiempo total desde entrada (seg): " . $tiempoTotal);
                    Log::info("Tiempo total de descansos (seg): " . $tiempoBreaks);
                    Log::info("Trabajo acumulado (seg): " . $trabajoAcumulado);
            
                    // Actualizar el fichaje de entrada con el tiempo trabajado acumulado
                    $entradaFichaje->update(['duracion' => $trabajoAcumulado]);
                }
            }
            

            if ($tipoFichaje === 'fin_descanso') {
                // Buscar el último fichaje de tipo 'inicio_descanso'
                $ultimoInicioDescanso = Fichaje::where('id_usuario', $idUsuario)
                    ->where('tipo_fichaje', 'inicio_descanso')
                    ->whereDate('fecha', $fecha)
                    ->orderBy('hora', 'desc')
                    ->first();
            
                if ($ultimoInicioDescanso) {
                    // Suponiendo que en la base de datos la hora se guarda como H:i:s
                    $horaInicio = Carbon::createFromFormat('H:i:s', $ultimoInicioDescanso->hora);
                    // Como el request trae la hora en formato H:i, le añadimos ":00"
                    $horaFin = Carbon::createFromFormat('H:i:s', $hora);
                    // Calcular la diferencia en segundos
                    $duracion = $horaInicio->diffInSeconds($horaFin);
                    Log::info("Duración de descanso en segundos: " . $duracion);
                }
            }           

            // Crear el nuevo fichaje
            $fichaje = Fichaje::create([
                'id_usuario' => $idUsuario,
                'tipo_fichaje' => $tipoFichaje,
                'fecha' => $fecha,
                'hora' => $hora,
                'ubicacion' => $ubicacion,
                'ciudad' => $ciudad,
                'latitud' => $latitud,
                'longitud' => $longitud,
                'duracion' => $duracion, // Se almacena solo en fin_descanso
                'comentarios' => $comentarios
            ]);

            return response()->json(['message' => 'Fichaje registrado correctamente', 'fichaje' => $fichaje], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al registrar fichaje', 'error' => $e->getMessage()], 500);
        }
    }



    // Obtener un fichaje por ID
    public function show($id)
    {
        return Fichaje::findOrFail($id);
    }

    // Actualizar un fichaje
    public function update(Request $request, $id)
    {
        $fichaje = Fichaje::findOrFail($id);
        $fichaje->update($request->all());
        return $fichaje;
    }

    // Eliminar un fichaje
    public function destroy($id)
    {
        Fichaje::destroy($id);
        return response()->json(['message' => 'Fichaje eliminado']);
    }

    // Obtener fichajes por trabajador y rango de fechas
    public function obtenerPorTrabajadorYRango(Request $request)
    {
        $request->validate([
            'id_usuario' => 'required|integer',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
        ]);

        $fichajes = Fichaje::where('id_usuario', $request->id_usuario)
            ->whereBetween('fecha', [$request->fecha_inicio, $request->fecha_fin])
            ->orderBy('fecha')
            ->orderBy('hora')
            ->get();

        return response()->json($fichajes);
    }

    public function obtenerFichajesPorFecha(Request $request)
    {
        try {
            // Validación de los parámetros
            $request->validate([
                'fecha' => 'nullable|date',
                'id_usuario' => 'nullable|integer|exists:users,id',
                'id_empresa' => 'required|integer|exists:empresas,id_empresa', // Validamos que se envíe la empresa
            ]);

            // Obtener la fecha de la solicitud o la fecha actual por defecto
            $fecha = $request->input('fecha', now()->toDateString());
            $idUsuario = $request->input('id_usuario');
            $idEmpresa = $request->input('id_empresa');

            Log::info("Fecha recibida: " . $fecha);
            Log::info("ID de usuario: " . $idUsuario);
            Log::info("ID de empresa: " . $idEmpresa);

            // Realizamos la consulta
            $fichajes = Fichaje::when($fecha, function ($query, $fecha) {
                    return $query->whereDate('fecha', $fecha);
                })
                ->when($idUsuario, function ($query, $idUsuario) {
                    return $query->where('id_usuario', $idUsuario);
                })
                ->whereHas('usuario', function ($query) use ($idEmpresa) {
                    $query->where('id_empresa', $idEmpresa); // Filtrar por empresa
                })
                ->with('usuario')  // Cargar la información del usuario asociado
                ->orderBy('fecha')
                ->orderBy('hora')
                ->get();

            Log::info($fichajes);

            // Verificar que la consulta trae datos
            if ($fichajes->isEmpty()) {
                Log::warning("No se encontraron fichajes para la fecha: " . $fecha . " en la empresa: " . $idEmpresa);
            }

            return response()->json($fichajes);

        } catch (\Exception $e) {
            // En caso de error, registramos la excepción y retornamos un error
            Log::error("Error al obtener fichajes: " . $e->getMessage());
            return response()->json(['message' => 'Error al obtener fichajes: ' . $e->getMessage()], 500);
        }
    }


    public function obtenerUltimoFichaje(Request $request)
    {
        $request->validate([
            'id_usuario' => 'required|integer|exists:users,id',
        ]);

        $idUsuario = $request->id_usuario;

        $ultimoFichaje = Fichaje::where('id_usuario', $idUsuario)
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$ultimoFichaje) {
            return response()->json(['mensaje' => 'No hay fichajes registrados'], 404);
        }

        return response()->json($ultimoFichaje);
    }

    // Obtiene los empleados que no han fichado entrada en la fecha consultada o el día actual en su defecto
    public function obtenerAusentes(Request $request)
    {
        // Si no hay fecha, usa hoy
        $fecha = $request->input('fecha', now()->toDateString());
        
        // Obtener el ID de la empresa (asegúrate de que venga en la petición)
        $idEmpresa = $request->input('id_empresa');

        if (!$idEmpresa) {
            return response()->json(['message' => 'ID de empresa es requerido'], 400);
        }

        // Obtener IDs de empleados que han fichado entrada ese día en la empresa
        $empleadosConEntrada = Fichaje::where('tipo_fichaje', 'entrada')
            ->whereDate('fecha', $fecha)
            ->whereHas('usuario', function ($query) use ($idEmpresa) {
                $query->where('id_empresa', $idEmpresa);
            })
            ->pluck('id_usuario');

        // Obtener empleados de la empresa que NO han fichado entrada ese día
        $empleadosAusentes = User::whereNotIn('id', $empleadosConEntrada)
            ->where('id_empresa', $idEmpresa) // Filtra por empresa
            ->whereDate('created_at', '<=', $fecha) // Excluir empleados creados después de la fecha consultada
            ->get();

        return response()->json($empleadosAusentes);
    }

    
    // Obtiene los empleados que no han fichado para cada día de la semana correspondiente a la fecha consultada
    public function obtenerAusentesSemana($fecha, $idEmpresa)
    {
        $fechaCarbon = Carbon::parse($fecha);
        $lunes = $fechaCarbon->startOfWeek(); // Obtiene el lunes de la semana
        // Obtenemos el viernes
        $viernes = $fechaCarbon->copy()->endOfWeek()->subDays(2);

        // Crear un array con los días de lunes a viernes con 0 por defecto
        $ausenciasSemana = [];

        for ($i = 0; $i < 5; $i++) {
            $dia = $lunes->copy()->addDays($i)->toDateString();

            // Contar empleados que fueron creados hasta ese día
            $totalEmpleados = User::where('estado', 'aceptada')
                ->where('rol', '!=', 'maestro')
                ->where('id_empresa', $idEmpresa)
                ->whereDate('created_at', '<=', $dia) // Excluir empleados creados después del día consultado
                ->count();

            $ausenciasSemana[$dia] = $totalEmpleados; // Todos ausentes por defecto
        }

        // Obtener IDs de empleados que ficharon cada día
        $fichajes = Fichaje::whereBetween('fecha', [$lunes, $viernes])
            ->where('tipo_fichaje', 'entrada')
            ->whereHas('usuario', function($query) use ($idEmpresa) {
                $query->where('id_empresa', $idEmpresa); // Filtrar por empresa
            })
            ->selectRaw('fecha as dia, COUNT(DISTINCT id_usuario) as presentes')
            ->groupBy('dia')
            ->orderBy('dia')
            ->get();

        // Calcular ausencias restando los presentes a los empleados totales de cada día
        foreach ($fichajes as $fichaje) {
            $ausenciasSemana[$fichaje->dia] -= $fichaje->presentes;
        }

        return response()->json($ausenciasSemana);
    }



    public function obtenerTiemposTotales($fecha, $idEmpresa)
{       
    $totalTrabajado = Fichaje::whereDate('fecha', $fecha)
        ->where('tipo_fichaje', 'entrada')
        ->whereHas('usuario', function($query) use ($idEmpresa) {
            $query->where('id_empresa', $idEmpresa); // Filtrar por empresa
        }) 
        ->sum('duracion');

    $totalDescanso = Fichaje::whereDate('fecha', $fecha)
        ->where('tipo_fichaje', 'fin_descanso')
        ->whereHas('usuario', function($query) use ($idEmpresa) {
            $query->where('id_empresa', $idEmpresa); // Filtrar por empresa
        })
        ->sum('duracion');

    return response()->json([
        'total_trabajado' => $totalTrabajado ?? 0,
        'total_descansos' => $totalDescanso ?? 0
    ]);
}




}