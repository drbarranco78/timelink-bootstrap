<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Credencial extends Model
{
    use HasFactory;

    protected $table = 'credenciales';
    protected $primaryKey = 'id_credencial';
    public $timestamps = false;

    protected $fillable = [
        'id_usuario',
        'password',
        'reset_code',
        'reset_code_expires',
    ];

    // Una credencial pertenece a un usuario
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id_usuario');
    }
}
