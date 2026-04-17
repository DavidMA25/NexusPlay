<?php

return [

    /*
     * Rutas a las que aplica CORS.
     * La API entera la exponemos; ajusta si quieres ser más restrictivo.
     */
    'paths' => ['api/*'],

    'allowed_methods' => ['*'],

    /*
     * Orígenes permitidos:
     * - React dev server
     * - WordPress (mismo servidor, puerto 80)
     * Amplía con tu dominio de producción cuando lo tengas.
     */
    'allowed_origins' => [
        env('FRONTEND_URL',   'http://localhost:5173'),
        env('WORDPRESS_URL',  'http://localhost/wordpress'),
        'http://localhost',
        'http://127.0.0.1',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    /*
     * false para peticiones sin cookies (API pura con Bearer token).
     * Si usas sesiones de Laravel, ponlo en true y configura los dominios en Sanctum.
     */
    'supports_credentials' => false,

];
