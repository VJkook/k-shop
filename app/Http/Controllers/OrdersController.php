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
        if (!$user->isAdmin() && !$user->isConfectioner()) {
            return response()->json(status: 403);
        }

        $validator = Validator::make($request->all(), [
            'id_confectioner' => ['integer', 'numeric'],
            'delivery_date' => ['date_format:' . BasicDate::DATE_FORMAT],
            'work_date' => ['date_format:' . BasicDate::YEAR_MONTH_DAY_FORMAT],
            'id_order_status' => ['integer', 'numeric'],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->getMessages(), 400);
        }

        $confectionerId = $request->get('id_confectioner');
        if (!is_null($confectionerId)) {
            $confectionerRepo = new ConfectionerRepository();
            $confectioner = $confectionerRepo->getById($confectionerId);
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

        if (!is_null($request->get('delivery_date'))) {
            $deliveryDate = BasicDate::fromDateString($request->get('delivery_date'));
            $this->orderRepo->updateDeliveryDate($id, $deliveryDate);
        }

        if (!is_null($request->get('id_order_status'))) {
            $this->orderRepo->updateStatus($id, $request->get('id_order_status'));
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
    public function show(Request $request, int $id): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();
        if (!$user->isAdmin() && !$user->isConfectioner()) {
            return response()->json(status: 403);
        }

        $response = $this->orderRepo->getById($id);
        return response()->json($response);
    }

    /**
     * Display the specified resource.
     */
    public function showByWorkDates(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'date_from' => ['date_format:' . BasicDate::YEAR_MONTH_DAY_FORMAT, 'required'],
            'date_to' => ['date_format:' . BasicDate::YEAR_MONTH_DAY_FORMAT, 'required'],
            'id_confectioners' => ['array'],
            'id_confectioners.*' => ['integer', 'numeric']
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->getMessages(), 400);
        }

        $dateFrom = BasicDate::fromYearMonthDayString($request->get('date_from'));
        $dateTo = BasicDate::fromYearMonthDayString($request->get('date_to'));

        $response = $this->orderRepo->getByWorkDates($dateFrom, $dateTo);
        return response()->json($response);
    }

    public function showForConfectioner(): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();
        if (!$user->isConfectioner()) {
            return response()->json(status: 403);
        }

        $response = $this->orderRepo->getByConfectionerId($user->id);
        return response()->json($response);
    }

    public function statuses(): JsonResponse
    {
        $response = $this->orderRepo->getStatuses();
        return response()->json($response);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }
}
