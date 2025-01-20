<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    use HasFactory;

    protected $table = 'usuarios';
    protected $primaryKey = 'id_usuario';
    public $timestamps = false;

    protected $fillable = [
        'dni',
        'nombre',
        'apellidos',
        'email',
        'cif_empresa',
        'cargo',
        'rol',
    ];

    // Un usuario pertenece a una empresa
    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'cif_empresa', 'cif');
    }

    // Un usuario tiene una credencial
    public function credencial()
    {
        return $this->hasOne(Credencial::class, 'id_usuario', 'id_usuario');
    }

    // Un usuario tiene muchos fichajes
    public function fichajes()
    {
        return $this->hasMany(Fichaje::class, 'id_usuario', 'id_usuario');
    }
}
