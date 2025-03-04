import Echo from 'laravel-echo';

import Pusher from 'pusher-js';
window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'reverb',
    host: import.meta.env.VITE_REVERB_HOST, // Usa el host de Railway
    client: new Pusher(import.meta.env.VITE_REVERB_APP_KEY, {
        cluster: 'mt1', // Obligatorio pero no se usa en Reverb
        wsHost: import.meta.env.VITE_REVERB_HOST, // Usa Railway o el dominio de tu backend
        wsPort: 80,
        wssPort: 443,
        forceTLS: true,
        enabledTransports: ['ws', 'wss'], // Permite WebSockets seguros
    }),
});
