<?php

namespace App\Http\Controllers;

use App\Models\ReadyCakeImageRelation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReadyCakeImageRelationsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return response()->json(ReadyCakeImageRelation::all()->toArray());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'id_ready_cake' => ['integer', 'numeric', 'required'],
            'id_image' => ['integer', 'numeric', 'required'],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->getMessages(), 400);
        }

        $attributes = [
            'id_ready_cake' => $request->id_ready_cake,
            'id_image' => $request->id_image
        ];

        $readyCakeImageRelation = ReadyCakeImageRelation::query()->create($attributes);
        $readyCakeImageRelation = ReadyCakeImageRelation::query()->find($readyCakeImageRelation->id);
        return response()->json($readyCakeImageRelation);
    }

    /**
     * Display the specified resource.
     */
    public function show(ReadyCakeImageRelation $readyCakeImageRelation): JsonResponse
    {
        return response()->json($readyCakeImageRelation->toArray());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ReadyCakeImageRelation $readyCakeImageRelation): JsonResponse
    {
        $isSuccess = ReadyCakeImageRelation::query()->find($readyCakeImageRelation->id)->delete();
        if (!$isSuccess) {
            return response()->json(['result' => 'error'], 500);
        }

        return response()->json(['result' => 'success']);
    }
}
