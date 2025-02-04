<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Fichaje;
use App\Models\User;

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
        $request->validate([
            'fecha' => 'nullable|date',
        ]);

        $fecha = $request->fecha;
        

        $fichajes = Fichaje::when($fecha, function ($query, $fecha) {
                return $query->whereDate('fecha', $fecha);
            })
            ->with('usuario') // Cargar la información del usuario asociado
            ->orderBy('fecha')
            ->orderBy('hora')
            ->get();

        return response()->json($fichajes);
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