<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return response()->json(Product::all()->toArray());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['string', 'required'],
            'price' => ['decimal:0,2', 'required'],
            'weight' => ['decimal:0,2', 'nullable'],
            'composition' => ['string', 'nullable'],
            'description' => ['string', 'nullable'],
        ]);

        if ($validator->fails()) {
            return \response()->json($validator->errors()->getMessages(), 400);
        }

        $attributes = [
            'name' => $request->name,
            'price' => $request->price,
            'weight' => $request->weight ?? null,
            'composition' => $request->composition ?? null,
            'description' => $request->description ?? null,
        ];

        $product = Product::query()->create($attributes);
        $product = Product::query()->find($product->id);
        return \response()->json($product);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product): JsonResponse
    {
        return response()->json($product->toArray());
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['string'],
            'price' => ['decimal:0,2'],
            'weight' => ['decimal:0,2', 'nullable'],
            'composition' => ['string', 'nullable'],
            '' => ['string', 'nullable'],
        ]);

        if ($validator->fails()) {
            return \response()->json($validator->errors()->getMessages(), 400);
        }

        if (!is_null($request->name)) {
            $product->name = $request->name;
        }
        if (!is_null($request->price)) {
            $product->price = $request->price;
        }
        if (!is_null($request->weight)) {
            $product->weight = $request->weight;
        }
        if (!is_null($request->composition)) {
            $product->composition = $request->composition;
        }
        if (!is_null($request->description)) {
            $product->description = $request->description;
        }

        $product->save();
        return response()->json($product);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product): JsonResponse
    {
        $isSuccess = Product::query()->find($product->id)->delete();
        if (!$isSuccess) {
            return response()->json(['result' => 'error'], 500);
        }

        return response()->json(['result' => 'success']);
    }
}
