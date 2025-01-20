<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    use HasFactory;

    protected $table = 'empresas';
    protected $primaryKey = 'id_empresa';
    public $timestamps = false;

    protected $fillable = [
        'cif',
        'nombre_empresa',
        'direccion',
        'telefono',
        'email',
    ];

    // Una empresa tiene muchos usuarios
    public function usuarios()
    {
        return $this->hasMany(Usuario::class, 'cif_empresa', 'cif');
    }
}
