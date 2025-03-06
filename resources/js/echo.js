import Echo from 'laravel-echo';

import Pusher from 'pusher-js';
window.Pusher = Pusher;

const useWebSockets = import.meta.env.VITE_USE_WEBSOCKETS === 'true';

let echo = null;

if (useWebSockets) {
    window.Echo = new Echo({
        broadcaster: 'reverb',
        key: import.meta.env.VITE_REVERB_APP_KEY,
        wsHost: import.meta.env.VITE_REVERB_HOST,
        wsPort: import.meta.env.VITE_REVERB_PORT ?? 8080,
        wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
        // forceTLS: false,
        forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
        enabledTransports: ['ws', 'wss'],
    });
}
// window.Echo.channel('fichajes')
//     .listen('.fichajeRealizado', (e) => {
//         console.log('Evento recibido:', e);

//         alert('¡Evento recibido en admin.js!');
//     });