<?php

namespace App\Http\Controllers;

use App\Repositories\CakeFormsRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CakeFormsController extends Controller
{
    public function __construct(protected CakeFormsRepository $cakeForms)
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $fillings = $this->cakeForms->all();
        return response()->json($fillings);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['string', 'required'],
        ]);

        if ($validator->fails()) {
            return \response()->json($validator->errors()->getMessages(), 400);
        }

        $attributes = [
            'name' => $request->name,
        ];

        $fillingResponse = $this->cakeForms->create($attributes);
        return \response()->json($fillingResponse);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        $response = $this->cakeForms->getById($id);
        return response()->json($response);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['string'],
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
            $fillingResponse = $this->cakeForms->getById($id);
            return response()->json($fillingResponse);
        }

        $fillingResponse = $this->cakeForms->updateById($id, $attributes);
        return response()->json($fillingResponse);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {

        $isSuccess = $this->cakeForms->deleteById($id);
        if (!$isSuccess) {
            return response()->json(['result' => 'error'], 500);
        }

        return response()->json(['result' => 'success']);
    }
}
