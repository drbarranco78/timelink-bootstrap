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
            ]);

            // Obtener la fecha de la solicitud o la fecha actual por defecto
            $fecha = $request->input('fecha', now()->toDateString());
            Log::info("Fecha recibida: " . $fecha);  // Registramos la fecha para verificar

            $idUsuario = $request->id_usuario;
            Log::info("ID de usuario: " . $idUsuario);  // También registramos el ID de usuario si está disponible

            // Realizamos la consulta
            $fichajes = Fichaje::when($fecha, function ($query, $fecha) {
                    return $query->whereDate('fecha', $fecha);
                })
                ->when($idUsuario, function ($query, $idUsuario) {
                    return $query->where('id_usuario', $idUsuario);
                })
                ->with('usuario')  // Cargar la información del usuario asociado
                ->orderBy('fecha')
                ->orderBy('hora')
                ->get();
                Log::info($fichajes);
            // Verificar que la consulta trae datos
            if ($fichajes->isEmpty()) {
                Log::warning("No se encontraron fichajes para la fecha: " . $fecha);
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



    public function obtenerAusentes(Request $request)
    {
        $fecha = $request->input('fecha', now()->toDateString()); // Si no hay fecha, usa hoy

        // Obtener IDs de empleados que han fichado entrada ese día
        $empleadosConEntrada = Fichaje::where('tipo_fichaje', 'entrada')
            ->whereDate('created_at', $fecha)
            ->pluck('id_usuario');

        // Obtener empleados que NO están en la lista de fichados
        $empleadosAusentes = User::whereNotIn('id', $empleadosConEntrada)->get();

        return response()->json($empleadosAusentes);
    }

    public function obtenerAusentesSemana($fecha)
    {
        $fechaCarbon = Carbon::parse($fecha);
        $lunes = $fechaCarbon->startOfWeek(); // Obtiene el lunes de la semana
        $viernes = $fechaCarbon->copy()->endOfWeek()->subDays(2); // Ajustamos para viernes

        // Obtener todos los empleados
        $totalEmpleados = User::where('estado', 'aceptada')
        ->where('rol', '!=', 'maestro')
        ->count();

        // Crear un array con los días de lunes a viernes con 0 por defecto
        $ausenciasSemana = [];
        for ($i = 0; $i < 5; $i++) {
            $dia = $lunes->copy()->addDays($i)->toDateString();
            $ausenciasSemana[$dia] = $totalEmpleados; // Todos ausentes por defecto
        }

        // Obtener IDs de empleados que ficharon cada día
        $fichajes = Fichaje::whereBetween('created_at', [$lunes, $viernes])
            ->where('tipo_fichaje', 'entrada')
            ->selectRaw('DATE(created_at) as dia, COUNT(DISTINCT id_usuario) as presentes')
            ->groupBy('dia')
            ->orderBy('dia')
            ->get();

        // Calcular ausencias restando los presentes a los empleados totales
        foreach ($fichajes as $fichaje) {
            $ausenciasSemana[$fichaje->dia] = $totalEmpleados - $fichaje->presentes;
        }

        return response()->json($ausenciasSemana);
    }


    public function obtenerTiemposTotales($fecha)
    {
        //$fecha = $request->input('fecha');
        

        $totalTrabajado = Fichaje::whereDate('fecha', $fecha)
            ->where('tipo_fichaje', 'entrada')
            ->sum('duracion');

        $totalDescanso = Fichaje::whereDate('fecha', $fecha)
            ->where('tipo_fichaje', 'fin_descanso')
            ->sum('duracion');

        $totalTrabajado = $totalTrabajado ?? 0;
        $totalDescanso = $totalDescanso ?? 0;

        // if ($totalTrabajado === 0 && $totalDescanso === 0) {
        //     return response()->json(['message' => 'No hay datos para la fecha seleccionada'], 404);
        // }

        return response()->json([
            'total_trabajado' => $totalTrabajado,
            'total_descansos' => $totalDescanso
        ]);
    }




}