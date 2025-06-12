<?php

namespace App\Http\Controllers;

use App\Models\BasicDate;
use App\Models\Order;
use App\Models\User;
use App\Repositories\BasketRepository;
use App\Repositories\OrderRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class OrdersController extends Controller
{
    public function __construct(public OrderRepository $orderRepo)
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();
        return response()->json($this->orderRepo->getByUserId($user->id));
    }

    public function all(): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();
        if (!$user->isAdmin()) {
            return response()->json(status: 403);
        }

        return response()->json($this->orderRepo->all());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'delivery_date' => ['date_format:' . BasicDate::DATE_FORMAT],
            'id_delivery_address' => ['integer', 'numeric', 'required'],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->getMessages(), 400);
        }

        $deliveryDate = null;
        if (isset($request->delivery_date)) {
            $deliveryDate = BasicDate::fromDateString($request->delivery_date);
        }

        /** @var User $user */
        $user = Auth::user();
        $basketRepo = new BasketRepository();
        $baskets = $basketRepo->getItemsByUserId($user->id);
        if (count($baskets) === 0) {
            return response()->json(['result' => 'basket is empty'], 400);
        }

        $response = $this->orderRepo->create(
            $user->id,
            $request->id_delivery_address,
            $baskets,
            $deliveryDate
        );

        $basketRepo->clearBasket($user->id);
        return response()->json($response);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();
        if (!$user->isAdmin()) {
            return response()->json(status: 403);
        }

        $validator = Validator::make($request->all(), [
            'id_confectioner' => ['integer', 'numeric'],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->getMessages(), 400);
        }

        return response()->json($this->orderRepo->update($id, $request->toArray()));
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }
}
