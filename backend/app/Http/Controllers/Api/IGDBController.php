<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\IGDBService;
use Illuminate\Http\Request;

// Controller responsible for handling game search queries via IGDB service
class IGDBController extends Controller
{
    private $igdbService;

    // Injects the IGDB service provider
    public function __construct(IGDBService $igdbService)
    {
        $this->igdbService = $igdbService;
    }

    // Returns a JSON list of games matching the query from request
    public function search(Request $request)
    {
        $query = $request->input('q');

        if (empty($query)) {
            return response()->json([]);
        }

        $games = $this->igdbService->searchGames($query);

        return response()->json($games);
    }
}
