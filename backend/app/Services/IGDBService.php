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

    /**
     * Get the OAuth2 access token for Twitch/IGDB API.
     * Caches the token for its valid duration (usually ~60 days).
     */
    public function getAccessToken()
    {
        if (!$this->clientId || !$this->clientSecret) {
            Log::error('IGDB Client ID or Secret not configured.');
            return null;
        }

        return Cache::remember('igdb_access_token', 5000000, function () {
            $response = Http::post('https://id.twitch.tv/oauth2/token', [
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

    /**
     * Search for games matching the query.
     */
    public function searchGames(string $query)
    {
        $token = $this->getAccessToken();

        if (!$token) {
            return [];
        }

        $body = "fields id, name, cover.url, summary, follows, total_rating_count; search \"{$query}\"; limit 50; where version_parent = null;";

        $response = Http::withHeaders([
            'Client-ID' => $this->clientId,
            'Authorization' => 'Bearer ' . $token,
            'Content-Type' => 'text/plain',
        ])->withBody($body, 'text/plain')->post('https://api.igdb.com/v4/games');

        if ($response->successful()) {
            $data = $response->json();
            
            // Sort results by popularity (total_rating_count + follows)
            usort($data, function($a, $b) {
                $scoreA = ($a['total_rating_count'] ?? 0) + ($a['follows'] ?? 0);
                $scoreB = ($b['total_rating_count'] ?? 0) + ($b['follows'] ?? 0);
                return $scoreB <=> $scoreA;
            });

            // Keep top 10 after sorting by popularity
            $data = array_slice($data, 0, 10);

            // Format the cover URLs to be full size instead of thumbnails
            return array_map(function ($game) {
                if (isset($game['cover']['url'])) {
                    // IGDB returns URLs like //images.igdb.com/igdb/image/upload/t_thumb/co1r7h.jpg
                    // We replace t_thumb with t_cover_big to get a nicer image
                    $game['cover']['url'] = 'https:' . str_replace('t_thumb', 't_cover_big', $game['cover']['url']);
                }
                return $game;
            }, $data);
        }

        Log::error('IGDB Search Failed: ' . $response->body());
        return [];
    }
}
