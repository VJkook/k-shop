<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class IngredientsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return response()->json(Ingredient::all()->toArray());
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

        $ingredient = Ingredient::query()->create($attributes);
        $ingredient = Ingredient::query()->find($ingredient->id);
        return \response()->json($ingredient);
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
    public function update(Request $request, Ingredient $ingredient): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['string'],
            'measurement' => ['string'],
            'quantity_in_stock' => ['decimal:0,2', 'nullable'],
        ]);

        if ($validator->fails()) {
            return \response()->json($validator->errors()->getMessages(), 400);
        }

        if (!is_null($request->name)) {
            $ingredient->name = $request->name;
        }
        if (!is_null($request->measurement)) {
            $ingredient->measurement = $request->measurement;
        }
        if (!is_null($request->quantity_in_stock)) {
            $ingredient->quantity_in_stock = $request->quantity_in_stock;
        }

        $ingredient->save();
        return response()->json($ingredient);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ingredient $ingredient): JsonResponse
    {
        $isSuccess = Ingredient::query()->find($ingredient->id)->delete();
        if (!$isSuccess) {
            return response()->json(['result' => 'error'], 500);
        }

        return response()->json(['result' => 'success']);
    }
}
