<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\IGDBService;
use Illuminate\Http\Request;

class IGDBController extends Controller
{
    private $igdbService;

    public function __construct(IGDBService $igdbService)
    {
        $this->igdbService = $igdbService;
    }

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
