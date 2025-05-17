<?php

namespace App\Http\Controllers;

use App\Repositories\CakeDesignerRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CakeDesignersController extends Controller
{
    public function __construct(protected CakeDesignerRepository $cakeDesignerRepo)
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $fillings = $this->cakeDesignerRepo->all();
        return response()->json($fillings);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['string', 'required'],
            'weight' => ['decimal:0,2', 'required'],
            'id_coverage' => ['integer', 'numeric', 'required'],
            'total_cost' => ['decimal:0,2'],
            'id_image' => ['integer', 'numeric'],
        ]);

        if ($validator->fails()) {
            return \response()->json($validator->errors()->getMessages(), 400);
        }

        $attributes = [
            'name' => $request->name,
            'price_by_kg' => $request->price_by_kg,
            'description' => $request->description ?? null,
        ];

        $fillingResponse = $this->cakeDesignerRepo->create($attributes);
        return \response()->json($fillingResponse);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        $response = $this->cakeDesignerRepo->getById($id);
        return response()->json($response);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['string'],
            'price_by_kg' => ['decimal:0,2'],
            'description' => ['string', 'nullable'],
            'id_image' => ['integer', 'numeric',],
        ]);

        if ($validator->fails()) {
            return \response()->json($validator->errors()->getMessages(), 400);
        }

        $attributes = [];
        if (!is_null($request->name)) {
            $attributes['name'] = $request->name;
        }
        if (!is_null($request->price_by_kg)) {
            $attributes['price_by_kg'] = $request->price_by_kg;
        }
        if (!is_null($request->description)) {
            $attributes['description'] = $request->description;
        }
        if (!is_null($request->id_image)) {
            $attributes['id_image'] = $request->id_image;
        }

        if (empty($attributes)) {
            $fillingResponse = $this->cakeDesignerRepo->getById($id);
            return response()->json($fillingResponse);
        }

        $fillingResponse = $this->cakeDesignerRepo->updateById($id, $attributes);
        return response()->json($fillingResponse);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        $isSuccess = $this->cakeDesignerRepo->deleteById($id);
        if (!$isSuccess) {
            return response()->json(['result' => 'error'], 500);
        }

        return response()->json(['result' => 'success']);
    }
}
