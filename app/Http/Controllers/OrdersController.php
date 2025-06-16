<?php

namespace App\Http\Controllers;

use App\Models\BasicDate;
use App\Models\BasicIntervalTime;
use App\Models\Order;
use App\Models\Responses\ErrorResponse;
use App\Models\User;
use App\Repositories\BasketRepository;
use App\Repositories\ConfectionerRepository;
use App\Repositories\MaxTimeForCookingRepository;
use App\Repositories\OrderRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
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
            'delivery_date' => ['date_format:' . BasicDate::DATE_FORMAT, 'required'],
            'id_delivery_address' => ['integer', 'numeric', 'required'],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->getMessages(), 400);
        }

        $deliveryDate = null;
        if (!is_null($request->get('delivery_date'))) {
            $deliveryDate = BasicDate::fromDateString($request->get('delivery_date'));
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
            $request->get('id_delivery_address'),
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
            'delivery_date' => ['date_format:' . BasicDate::DATE_FORMAT],
            'work_date' => ['date_format:' . BasicDate::YEAR_MONTH_DAY_FORMAT],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->getMessages(), 400);
        }

        $confectionerId = $request->get('id_confectioner');
        if (!is_null($confectionerId)) {
            $confectionerRepo = new ConfectionerRepository();
            $confectioner = $confectionerRepo->getResponseById($confectionerId);
            if (is_null($confectioner)) {
                return response()->json((new ErrorResponse('confectioner not exits')), 400);
            }
            //TODO: возможно лишнее
//            $confectionerBusyTimeErr = $this->checkConfectionerBusyTimeValid($confectionerId, $id);
//            if (!is_null($confectionerBusyTimeErr)) {
//                return response()->json($confectionerBusyTimeErr, 400);
//            }

            $this->orderRepo->setConfectionerToOrder($id, $confectionerId);
        }

        $response = $this->orderRepo->getById($id);
        return response()->json($response);
    }

    private function checkConfectionerBusyTimeValid(int $confectionerId, $orderId): ?ErrorResponse
    {
        $order = $this->orderRepo->getById($orderId);
        $confectionerRepo = new ConfectionerRepository();

        $busyTime = $confectionerRepo->getBusyTime(
            $confectionerId,
            BasicDate::fromYearMonthDayString($order->work_date)
        );
        $orderCookingTime = $this->orderRepo->getOrderCookingTime($orderId);

        $busyTime->add($orderCookingTime);

        $maxTimeRepo = new MaxTimeForCookingRepository();
        $maxTime = $maxTimeRepo->getMax();
        if ($busyTime->gt($maxTime)) {
            return new ErrorResponse(
                sprintf('Busy time greater than: %s', $maxTime->toStringInterval())
            );
        }

        return null;
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
