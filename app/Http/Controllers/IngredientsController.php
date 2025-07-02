<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use App\Repositories\IngredientsRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class IngredientsController extends Controller
{
    public function __construct(protected IngredientsRepository $ingredientsRepo)
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return response()->json($this->ingredientsRepo->all());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['string', 'required'],
            'measurement' => ['string', 'required'],
            'quantity_in_stock' => ['decimal:0,2', 'nullable'],
        ]);

        if ($validator->fails()) {
            return \response()->json($validator->errors()->getMessages(), 400);
        }

        $attributes = [
            'name' => $request->name ?? '',
            'measurement' => $request->measurement ?? '',
            'quantity_in_stock' => $request->quantity_in_stock ?? null,
        ];

        $response = $this->ingredientsRepo->create($attributes);
        return \response()->json($response);
    }

    /**
     * Display the specified resource.
     */
    public function show(Ingredient $ingredient): JsonResponse
    {
        return response()->json($ingredient->toArray());
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['string'],
            'measurement' => ['string'],
            'quantity_in_stock' => ['decimal:0,2', 'nullable'],
        ]);

        if ($validator->fails()) {
            return \response()->json($validator->errors()->getMessages(), 400);
        }

        $attributes = [];
        if (!is_null($request->get('name'))) {
            $attributes['name'] = $request->get('name');
        }
        if (!is_null($request->get('measurement'))) {
            $attributes['measurement'] = $request->get('measurement');
        }
        if (!is_null($request->get('quantity_in_stock'))) {
            $attributes['quantity_in_stock'] = $request->get('quantity_in_stock');
        }

        $response = $this->ingredientsRepo->updateById($id, $attributes);
        return response()->json($response);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        $isSuccess = $this->ingredientsRepo->deleteById($id);
        if (!$isSuccess) {
            return response()->json(['result' => 'error'], 500);
        }

        return response()->json(['result' => 'success']);
    }
}
