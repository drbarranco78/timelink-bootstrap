<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;
    protected $table = 'usuarios';
    protected $primaryKey = 'id_usuario';
    public $timestamps = false;
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'dni',
        'nombre',
        'apellidos',
        'email',
        'cif_empresa',
        'cargo',
        'rol',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
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
