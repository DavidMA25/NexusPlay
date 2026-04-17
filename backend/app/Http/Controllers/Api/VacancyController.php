<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVacancyRequest;
use App\Http\Resources\VacancyResource;
use App\Models\Vacancy;
use Illuminate\Http\Request;

class VacancyController extends Controller
{
    public function index()
    {
        return VacancyResource::collection(
            Vacancy::with('team')->latest()->paginate(5)
        );
    }

    public function store(StoreVacancyRequest $request)
    {
        $vacancy = Vacancy::create($request->validated());

        return new VacancyResource($vacancy);
    }

    public function show(Vacancy $vacancy)
    {
        return new VacancyResource(
            $vacancy->load('team')
        );
    }

    public function update(StoreVacancyRequest $request, Vacancy $vacancy)
    {
        $vacancy->update($request->validated());

        return new VacancyResource($vacancy);
    }

    public function destroy(Vacancy $vacancy)
    {
        $vacancy->delete();

        return response()->noContent();
    }
}
