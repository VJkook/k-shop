<?php

namespace App\Http\Controllers;

use App\Repositories\TechnologicalMapsRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TechnologicalMapsController extends Controller
{
    public function __construct(protected TechnologicalMapsRepository $technologicalMapsRepo)
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $technologicalMapResponses = $this->technologicalMapsRepo->all();
        return response()->json($technologicalMapResponses);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['string', 'required'],
            'description' => ['string', 'nullable'],
        ]);

        if ($validator->fails()) {
            return \response()->json($validator->errors()->getMessages(), 400);
        }

        $attributes = [
            'name' => $request->name,
            'description' => $request->description ?? null,
        ];

        $technologicalMapResponse = $this->technologicalMapsRepo->create($attributes);
        return \response()->json($technologicalMapResponse);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        $response = $this->technologicalMapsRepo->getById($id);
        return response()->json($response);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['string'],
            'description' => ['string', 'nullable'],
        ]);

        if ($validator->fails()) {
            return \response()->json($validator->errors()->getMessages(), 400);
        }

        $attributes = [];
        if (!is_null($request->name)) {
            $attributes['name'] = $request->name;
        }
        if (!is_null($request->description)) {
            $attributes['description'] = $request->description;
        }


        if (empty($attributes)) {
            $technologicalMapResponse = $this->technologicalMapsRepo->getById($id);
            return response()->json($technologicalMapResponse);
        }

        $technologicalMapResponse = $this->technologicalMapsRepo->updateById($id, $attributes);
        return response()->json($technologicalMapResponse);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        $isSuccess = $this->technologicalMapsRepo->deleteById($id);
        if (!$isSuccess) {
            return response()->json(['result' => 'error'], 500);
        }

        return response()->json(['result' => 'success']);
    }
}
