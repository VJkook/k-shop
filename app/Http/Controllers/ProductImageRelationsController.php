<?php

namespace App\Http\Controllers;

use App\Models\ProductImageRelation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductImageRelationsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return response()->json(ProductImageRelation::all()->toArray());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'id_product' => ['integer', 'numeric', 'required'],
            'id_image' => ['integer', 'numeric', 'required'],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->getMessages(), 400);
        }

        $attributes = [
            'id_product' => $request->id_product,
            'id_image' => $request->id_image
        ];

        $readyCakeImageRelation = ProductImageRelation::query()->create($attributes);
        $readyCakeImageRelation = ProductImageRelation::query()->find($readyCakeImageRelation->id);
        return response()->json($readyCakeImageRelation);
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductImageRelation $readyCakeImageRelation): JsonResponse
    {
        return response()->json($readyCakeImageRelation->toArray());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductImageRelation $readyCakeImageRelation): JsonResponse
    {
        $isSuccess = ProductImageRelation::query()->find($readyCakeImageRelation->id)->delete();
        if (!$isSuccess) {
            return response()->json(['result' => 'error'], 500);
        }

        return response()->json(['result' => 'success']);
    }
}
