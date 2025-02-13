<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Fichaje;
use App\Models\User;
use Illuminate\Support\Facades\Log;

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
            'tipo_fichaje' => 'required|in:entrada,salida,inicio_descanso,fin_descanso',
            'fecha' => 'required|date',
            'hora' => 'required|date_format:H:i',
            'ubicacion' => 'nullable|string'
        ]);

        try {
            // Formatear la hora para asegurarse de que no tenga segundos
            $horaFormateada = date('H:i', strtotime($request->hora));

            // Crear el registro de fichaje
            $fichaje = Fichaje::create([
                'id_usuario' => $request->id_usuario,
                'tipo_fichaje' => $request->tipo_fichaje,
                'fecha' => $request->fecha,
                'hora' => $horaFormateada,
                'ubicacion' => $request->ubicacion
            ]);

            // Respuesta JSON con éxito
            return response()->json([
                'ok' => true,
                'message' => 'Fichaje registrado correctamente'                
            ], 201);

        } catch (\Exception $e) {
            // Respuesta JSON en caso de error
            return response()->json([
                'ok' => false,
                'message' => 'Error al registrar el fichaje: ' . $e->getMessage()
            ], 500);
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

}