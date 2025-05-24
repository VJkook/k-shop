<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Repositories\BasketRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        /** @var User $user */
        $user = Auth::user();
        $baskets = $this->basketRepo->getItemsByUserId($user->id);
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

        /** @var User $user */
        $user = Auth::user();
        $basket = $this->basketRepo->create($user->id, $request->id_product, $request->count ?: 1);
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

        /** @var User $user */
        $user = Auth::user();
        if (!is_null($request->count) && $request->count < 1) {
            return response()->json($this->basketRepo->getItemsByUserId($user->id));
        }

        return response()->json($this->basketRepo->updateById($id, $user->id, $request->count));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();
        $isSuccess = $this->basketRepo->deleteById($id, $user->id);
        if (!$isSuccess) {
            return response()->json(['result' => 'error'], 500);
        }

        return response()->json(['result' => 'success']);
    }
}
