<?php

namespace Tests\Feature;

use Tests\TestCase;

class PlayerApiTest extends TestCase
{
    /**
     * Prueba que el catálogo de jugadores responde correctamente (200 OK).
     */
    public function test_can_fetch_public_players_list(): void
    {
        // Simulamos que el frontend hace una petición GET a la ruta
        $response = $this->getJson('/api/players');

        // Afirmamos que el servidor debe responder con un código 200 (Éxito)
        $response->assertStatus(200);
    }
}
