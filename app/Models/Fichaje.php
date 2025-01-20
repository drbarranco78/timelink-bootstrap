<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fichaje extends Model
{
    use HasFactory;

    protected $table = 'fichajes';
    protected $primaryKey = 'id_fichaje';
    public $timestamps = false;

    protected $fillable = [
        'id_usuario',
        'tipo_fichaje',
        'fecha',
        'hora',
        'ubicacion',
    ];

    // Un fichaje pertenece a un usuario
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id_usuario');
    }
}
