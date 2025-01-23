<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

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
        return $this->belongsTo(User::class, 'id_usuario', 'id');
    }
}
