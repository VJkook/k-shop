<?php

namespace App\Http\Controllers;

use App\Models\BasicDate;
use App\Models\Order;
use App\Models\User;
use App\Repositories\BasketRepository;
use App\Repositories\OrderRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
        return response()->json($this->orderRepo->getAll(User::SYSTEM_USER_ID));
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
            $deliveryDate = BasicDate::fromString($request->delivery_date);
        }

        $userId = User::SYSTEM_USER_ID;
        $basketRepo = new BasketRepository();
        $baskets = $basketRepo->getItemsByUserId($userId);
        if (count($baskets) === 0) {
            return response()->json(['result' => 'basket is empty'], 400);
        }

        $response = $this->orderRepo->create(
            $userId,
            $request->id_delivery_address,
            $baskets,
            $deliveryDate
        );

        $basketRepo->clearBasket($userId);
        return response()->json($response);
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
