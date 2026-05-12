<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class IGDBService
{
    private $clientId;
    private $clientSecret;

    public function __construct()
    {
        $this->clientId = env('IGDB_CLIENT_ID');
        $this->clientSecret = env('IGDB_CLIENT_SECRET');
    }

    public function getAccessToken()
    {
        if (!$this->clientId || !$this->clientSecret) {
            Log::error('IGDB Client ID or Secret not configured.');
            return null;
        }

        return Cache::remember('igdb_access_token', 5000000, function () {
            $response = Http::withoutVerifying()->post('https://id.twitch.tv/oauth2/token', [
                'client_id' => $this->clientId,
                'client_secret' => $this->clientSecret,
                'grant_type' => 'client_credentials',
            ]);

            if ($response->successful()) {
                return $response->json('access_token');
            }

            Log::error('Failed to get IGDB access token: ' . $response->body());
            return null;
        });
    }

    public function searchGames(string $query)
    {
        $token = $this->getAccessToken();

        if (!$token) {
            return [];
        }

        $body = "fields id, name, cover.url, summary, follows, total_rating_count; search \"{$query}\"; limit 50; where version_parent = null;";

        $response = Http::withoutVerifying()->withHeaders([
            'Client-ID' => $this->clientId,
            'Authorization' => 'Bearer ' . $token,
            'Content-Type' => 'text/plain',
        ])->withBody($body, 'text/plain')->post('https://api.igdb.com/v4/games');

        if ($response->successful()) {
            $data = $response->json();

            usort($data, function($a, $b) {
                $scoreA = ($a['total_rating_count'] ?? 0) + ($a['follows'] ?? 0);
                $scoreB = ($b['total_rating_count'] ?? 0) + ($b['follows'] ?? 0);
                return $scoreB <=> $scoreA;
            });

            $data = array_slice($data, 0, 10);

            return array_map(function ($game) {
                if (isset($game['cover']['url'])) {

                    $game['cover']['url'] = 'https:' . str_replace('t_thumb', 't_cover_big', $game['cover']['url']);
                }
                return $game;
            }, $data);
        }

        Log::error('IGDB Search Failed: ' . $response->body());
        return [];
    }
    public function getGameById(int $id)
    {
        return Cache::remember("igdb_game_{$id}", 86400, function () use ($id) {
            $token = $this->getAccessToken();
            if (!$token) return null;

            $body = "fields name; where id = {$id};";

            $response = Http::withoutVerifying()->withHeaders([
                'Client-ID' => $this->clientId,
                'Authorization' => 'Bearer ' . $token,
                'Content-Type' => 'text/plain',
            ])->withBody($body, 'text/plain')->post('https://api.igdb.com/v4/games');

            if ($response->successful()) {
                $data = $response->json();
                return $data[0]['name'] ?? null;
            }

            return null;
        });
    }
}
