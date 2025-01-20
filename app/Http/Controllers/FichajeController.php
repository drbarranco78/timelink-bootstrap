<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Fichaje;

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
            'id_usuario' => 'required|exists:usuario,id_usuario',
            'tipo_fichaje' => 'required|in:entrada,salida,inicio_descanso,fin_descanso',
            'fecha' => 'required|date',
            'hora' => 'required|date_format:H:i:s',
        ]);

        return Fichaje::create($request->all());
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

}
