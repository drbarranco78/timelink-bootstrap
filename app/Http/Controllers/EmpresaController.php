<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Empresa;
use Illuminate\Support\Facades\Validator;

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
        return response()->json([
            'message' => 'Empresa creada correctamente',            
            'empresa' => $empresa,
        ], 201);
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
    // public function update(Request $request, $id)
    // {
    //     $empresa = Empresa::find($id);

    //     if (!$empresa) {
    //         return response()->json(['message' => 'Empresa no encontrada'], 404);
    //     }

    //     $empresa->update($request->all()); 
    //     return response()->json($empresa);
    // }

    // Elimina una empresa por su id 
    public function destroy($id)
    {
        $empresa = Empresa::find($id);

        if (!$empresa) {
            return response()->json(['message' => 'Empresa no encontrada'], 404);
        }

        $empresa->delete(); // Elimina la empresa
        return response()->json([
            'message' => 'Empresa eliminada',
            'redirect' => '/'
        ]);
    }

    public function update(Request $request)
    {
        // Validar los datos recibidos
        $request->validate([
            'id_empresa' => 'required|exists:empresas,id_empresa',
            'cif' => 'required|string|max:20',
            'nombre_empresa' => 'required|string|max:255',
            'direccion' => 'nullable|string|max:255',
            'telefono' => 'nullable|string|max:15',
            'email' => 'required|email:rfc|max:255',
            
        ], [
            'email.email' => 'El formato de email no es válido'    
        ]);
        
        // Buscar la empresa por su ID
        
        $empresa = Empresa::find($request->id_empresa);
        if (!$empresa) {
            return response()->json(['message' => 'Empresa no encontrada'], 404);
        }

        // Asignar nuevos valores
        $empresa->cif = $request->input('cif');
        $empresa->nombre_empresa = $request->input('nombre_empresa');
        $empresa->direccion = $request->input('direccion');
        $empresa->telefono = $request->input('telefono');
        $empresa->email = $request->input('email');
        

        // Guardar los cambios
        $empresa->save();

        return response()->json(['message' => 'Empresa actualizada con éxito']);
    }

}