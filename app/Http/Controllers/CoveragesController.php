<?php

namespace App\Http\Controllers;

use App\Repositories\CoveragesRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CoveragesController extends Controller
{
    public function __construct(protected CoveragesRepository $coverageRepo)
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $fillings = $this->coverageRepo->all();
        return response()->json($fillings);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['string', 'required'],
            'price' => ['decimal:0,2', 'required'],
            'description' => ['string', 'nullable'],
            'id_image' => ['integer', 'numeric',],
        ]);

        if ($validator->fails()) {
            return \response()->json($validator->errors()->getMessages(), 400);
        }

        $attributes = [
            'name' => $request->name,
            'price' => $request->price,
            'description' => $request->description ?? null,
            'id_image' => $request->id_image ?? null,
        ];

        $fillingResponse = $this->coverageRepo->create($attributes);
        return \response()->json($fillingResponse);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        $response = $this->coverageRepo->getById($id);
        return response()->json($response);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['string'],
            'price' => ['decimal:0,2'],
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
        if (!is_null($request->price)) {
            $attributes['price'] = $request->price;
        }
        if (!is_null($request->description)) {
            $attributes['description'] = $request->description;
        }
        if (!is_null($request->id_image)) {
            $attributes['id_image'] = $request->id_image;
        }

        if (empty($attributes)) {
            $coverageResponse = $this->coverageRepo->getById($id);
            return response()->json($coverageResponse);
        }

        $coverageResponse = $this->coverageRepo->updateById($id, $attributes);
        return response()->json($coverageResponse);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        $isSuccess = $this->coverageRepo->deleteById($id);
        if (!$isSuccess) {
            return response()->json(['result' => 'error'], 500);
        }

        return response()->json(['result' => 'success']);
    }
}
