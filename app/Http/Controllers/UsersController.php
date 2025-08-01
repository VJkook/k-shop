<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Repositories\DeliveryAddressesRepository;
use App\Repositories\UserRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UsersController extends Controller
{
    public function __construct(protected UserRepository $userRepo)
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $users = $this->userRepo->all();
        return response()->json($users);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
//        $response = $this->fillingRepo->getById($id);
//        return response()->json($response);
    }
    
    public function addresses(): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();
        $deliveryAddressesRepo = new DeliveryAddressesRepository();
        $addresses = $deliveryAddressesRepo->getByUserId($user->id);
        
        return response()->json($addresses);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id): JsonResponse
    {
//        $validator = Validator::make($request->all(), [
//            'name' => ['string'],
//            'price_by_kg' => ['decimal:0,2'],
//            'description' => ['string', 'nullable'],
//            'id_image' => ['integer', 'numeric',],
//        ]);
//
//        if ($validator->fails()) {
//            return \response()->json($validator->errors()->getMessages(), 400);
//        }
//
//        $attributes = [];
//        if (!is_null($request->name)) {
//            $attributes['name'] = $request->name;
//        }
//        if (!is_null($request->price_by_kg)) {
//            $attributes['price_by_kg'] = $request->price_by_kg;
//        }
//        if (!is_null($request->description)) {
//            $attributes['description'] = $request->description;
//        }
//        if (!is_null($request->id_image)) {
//            $attributes['id_image'] = $request->id_image;
//        }
//
//        if (empty($attributes)) {
//            $fillingResponse = $this->fillingRepo->getById($id);
//            return response()->json($fillingResponse);
//        }
//
//        $fillingResponse = $this->fillingRepo->updateById($id, $attributes);
//        return response()->json($fillingResponse);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {

        $isSuccess = $this->userRepo->deleteById($id);
        if (!$isSuccess) {
            return response()->json(['result' => 'error'], 500);
        }

        return response()->json(['result' => 'success']);
    }
}
