import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

// export default defineConfig({
//     plugins: [
//         laravel({
//             input: ['public/css/app.css', 'public/js/app.js'],
//             refresh: true,
//         }),
//     ],
// });

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/js/app.js',
                'resources/js/echo.js',
                'public/js/admin.js',
                'resources/css/app.css'
            ],
            refresh: true,
        }),
    ],
});