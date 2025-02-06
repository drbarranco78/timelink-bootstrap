<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Invitacion extends Model{

    use HasFactory;

    
    protected $table = 'invitaciones'; 

    
    protected $fillable = [
        'email',
        'id_empresa',
        'fecha_expiracion',
    ];

    // Establecer la relación con la tabla Empresa
    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'id_empresa');
    }

    // Configurar la fecha de expiración
    protected $dates = ['fecha_expiracion'];

}