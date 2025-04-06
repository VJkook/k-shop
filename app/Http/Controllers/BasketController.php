<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Repositories\BasketRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BasketController extends Controller
{
    public function __construct(public BasketRepository $basketRepo)
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $baskets = $this->basketRepo->getItemsByUserId(User::SYSTEM_USER_ID);
        return response()->json($baskets);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'id_product' => ['integer', 'numeric', 'required'],
            'count' => ['integer', 'numeric'],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->getMessages(), 400);
        }

        $basket = $this->basketRepo->create(User::SYSTEM_USER_ID, $request->id_product, $request->count ?: 1);
        return response()->json($basket);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'count' => ['integer', 'numeric'],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->getMessages(), 400);
        }

        if (!is_null($request->count) && $request->count < 1) {
            return response()->json($this->basketRepo->getItemById($id, User::SYSTEM_USER_ID));
        }

        return response()->json($this->basketRepo->updateById($id, User::SYSTEM_USER_ID, $request->count));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        $isSuccess = $this->basketRepo->deleteById($id);
        if (!$isSuccess) {
            return response()->json(['result' => 'error'], 500);
        }

        return response()->json(['result' => 'success']);
    }
}
