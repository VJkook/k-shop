<?php

namespace App\Http\Controllers;

use App\Models\BasicIntervalTime;
use App\Repositories\CookingStepsRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CookingStepsController extends Controller
{
    public function __construct(protected CookingStepsRepository $cookingStepsRepo)
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $fillings = $this->cookingStepsRepo->all();
        return response()->json($fillings);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request, int $technologicalMapId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'description' => ['string', 'required'],
            'step_time' => ['regex:/\d+:\d+:\d+/', 'required'],
            'id_image' => ['integer', 'numeric', 'nullable'],
            'step_number' => ['integer', 'numeric', 'required'],
        ]);

        if ($validator->fails()) {
            return \response()->json($validator->errors()->getMessages(), 400);
        }

        $attributes = [
            'description' => $request->description,
            'id_image' => $request->id_image ?? null,
            'step_number' => $request->step_number,
        ];

        $stepTime = BasicIntervalTime::fromIntervalString($request->get('step_time'));

        $stepResponse = $this->cookingStepsRepo->create($attributes, $technologicalMapId, $stepTime);
        return \response()->json($stepResponse);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        $response = $this->cookingStepsRepo->getById($id);
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
            $fillingResponse = $this->cookingStepsRepo->getById($id);
            return response()->json($fillingResponse);
        }

        $fillingResponse = $this->cookingStepsRepo->updateById($id, $attributes);
        return response()->json($fillingResponse);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $mapId, int $stepId): JsonResponse
    {
        $isSuccess = $this->cookingStepsRepo->deleteById($stepId);
        if (!$isSuccess) {
            return response()->json(['result' => 'error'], 500);
        }

        return response()->json(['result' => 'success']);
    }
}
