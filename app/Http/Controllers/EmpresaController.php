<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Empresa;

class EmpresaController extends Controller
{
    // Obtiene todas las empresas
    public function index()
    {        
        $empresas = Empresa::all(); 
        return response()->json(['array' => $empresas]);
    }

    // Crea una nueva empresa
    public function store(Request $request)
{
    // Validar los datos de entrada
    $request->validate([
        'cif' => 'required|string|max:15',
        'nombre_empresa' => 'required|string|max:100',
        'direccion' => 'nullable|string|max:255',
        'telefono' => 'nullable|string|max:15',
        'email' => 'nullable|string|email|max:100',
    ]);

    // Comprobar si ya existe una empresa con el mismo CIF
    if (Empresa::where('cif', $request->cif)->exists()) {
        return response()->json([
            'error' => true,
            'message' => 'La empresa con el CIF proporcionado ya existe.'
        ], 400); 
    }

    // Crear la nueva empresa
    $empresa = Empresa::create($request->all());

    // Retornar la respuesta en formato JSON
    return response()->json($empresa, 201);
}


    // Busca una empresa por su id
    public function show($id)
    {
        $empresa = Empresa::find($id);

        if (!$empresa) {
            return response()->json(['message' => 'Empresa no encontrada'], 404);
        }

        return response()->json($empresa);
    }

    // Actualiza los datos de una empresa
    public function update(Request $request, $id)
    {
        $empresa = Empresa::find($id);

        if (!$empresa) {
            return response()->json(['message' => 'Empresa no encontrada'], 404);
        }

        $empresa->update($request->all()); 
        return response()->json($empresa);
    }

    // Elimina una empresa por su id 
    public function destroy($id)
    {
        $empresa = Empresa::find($id);

        if (!$empresa) {
            return response()->json(['message' => 'Empresa no encontrada'], 404);
        }

        $empresa->delete(); // Elimina la empresa
        return response()->json(['message' => 'Empresa eliminada']);
    }
}
