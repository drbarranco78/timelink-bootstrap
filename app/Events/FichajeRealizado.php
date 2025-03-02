<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class FichajeRealizado implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public $fichaje;

    /**
     * Create a new event instance.
     */
    public function __construct($fichaje)
    {
        $this->fichaje = $fichaje;
        
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        // return [
        //     new PrivateChannel('channel-name'),
        // ];
        return new Channel('fichajes');
    }
    public function broadcastAs()
    {
        return 'fichajeRealizado';
    }
    // public function broadcastWith()
    // {
    //     return [
    //         'fichaje' => [
    //             'id_usuario' => $this->fichaje->id_usuario,
    //             'tipo_fichaje' => $this->fichaje->tipo_fichaje,
    //             'fecha' => $this->fichaje->fecha,
    //             'hora' => $this->fichaje->hora,
    //             'ubicacion' => $this->fichaje->ubicacion,
    //             'ciudad' => $this->fichaje->ciudad,
    //             // Omite latitud, longitud, duracion, comentarios si no los necesitas
    //         ]
    //     ];
    // }
}
