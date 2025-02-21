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
        // Validación de datos con mensajes personalizados
        $request->validate([
            'cif' => [
                'required',
                'string',
                'max:15',
                'regex:/^[A-Z0-9]{8,15}$/', // Permite letras mayúsculas y números, de 8 a 15 caracteres
                'unique:empresas,cif'
            ],
            'nombre_empresa' => 'required|string|max:100',
            'direccion' => 'nullable|string|max:255',
            'telefono' => 'nullable|string|regex:/^\+?[0-9]{7,15}$/', // Solo números, opcionalmente con prefijo +
            'email' => 'nullable|string|email|max:100',
        ], [
            'cif.required' => 'El CIF es obligatorio.',
            'cif.string' => 'El CIF debe ser un texto.',
            'cif.max' => 'El CIF no puede superar los 15 caracteres.',
            'cif.regex' => 'El CIF debe contener solo letras mayúsculas y números (mínimo 8 caracteres).',
            'cif.unique' => 'La empresa con el CIF proporcionado ya existe.',
    
            'nombre_empresa.required' => 'El nombre de la empresa es obligatorio.',
            'nombre_empresa.string' => 'El nombre de la empresa debe ser un texto.',
            'nombre_empresa.max' => 'El nombre de la empresa no puede superar los 100 caracteres.',
    
            'direccion.string' => 'La dirección debe ser un texto.',
            'direccion.max' => 'La dirección no puede superar los 255 caracteres.',
    
            'telefono.string' => 'El teléfono debe ser un texto.',
            'telefono.regex' => 'El teléfono debe contener solo números y puede incluir un prefijo (+).',
    
            'email.string' => 'El email debe ser un texto.',
            'email.email' => 'El formato del email no es válido.',
            'email.max' => 'El email no puede superar los 100 caracteres.',
        ]);
    
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

    // Actualiza los datos de una empresa
    public function update(Request $request)
    {
        // Validar los datos recibidos
        $request->validate([
            'id_empresa' => 'required|exists:empresas,id_empresa',
            'cif' =>  'required|string|max:15|regex:/^[A-Z0-9]{8,15}$/',
            'nombre_empresa' => 'required|string|max:255',
            'direccion' => 'nullable|string|max:255',
            'telefono' => 'nullable|string|regex:/^\+?[0-9]{7,15}$/',
            'email' => 'nullable|email:rfc|max:255|unique:empresas,email',
        ], [
            'cif.required' => 'El CIF es obligatorio.',
            'cif.string' => 'El CIF debe ser un texto.',
            'cif.max' => 'El CIF no puede superar los 15 caracteres.',
            'cif.regex' => 'El CIF debe contener solo letras mayúsculas y números (de 8 a 15 caracteres).',            

            'nombre_empresa.required' => 'El nombre de la empresa es obligatorio.',
            'nombre_empresa.string' => 'El nombre de la empresa debe ser un texto.',
            'nombre_empresa.max' => 'El nombre de la empresa no puede superar los 255 caracteres.',

            'direccion.string' => 'La dirección debe ser un texto.',
            'direccion.max' => 'La dirección no puede superar los 255 caracteres.',

            'telefono.string' => 'El teléfono debe ser un texto.',
            'telefono.regex' => 'El teléfono debe contener solo números y puede incluir un prefijo (+).',

            'email.email' => 'El formato del email no es válido.',
            'email.unique' => 'Ya existe una empresa con el mismo email.',
            'email.max' => 'El email no puede superar los 255 caracteres.',
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