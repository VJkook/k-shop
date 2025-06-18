<?php

namespace App\Http\Controllers;

use App\Models\BasicDate;
use App\Repositories\ConfectionerRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ConfectionersController extends Controller
{
    public function __construct(protected ConfectionerRepository $confectionerRepo)
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $confectioners = $this->confectionerRepo->all();
        return response()->json($confectioners);
    }

    public function getAvailableByDate(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'date' => ['date_format:' . BasicDate::YEAR_MONTH_DAY_FORMAT, 'required'],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->getMessages(), 400);
        }


        $date = BasicDate::fromYearMonthDayString($request->get('date'));
        $confectioners = $this->confectionerRepo->getAvailableByDate($date);
        return response()->json($confectioners);
    }

    public function getConfectionersCalendar(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'date_from' => ['date_format:' . BasicDate::YEAR_MONTH_DAY_FORMAT, 'required'],
            'date_to' => ['date_format:' . BasicDate::YEAR_MONTH_DAY_FORMAT, 'required'],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->getMessages(), 400);
        }

        $dateFrom = BasicDate::fromYearMonthDayString($request->get('date_from'));
        $dateTo = BasicDate::fromYearMonthDayString($request->get('date_to'));
        $calendar = $this->confectionerRepo->getConfectionersCalendar($dateFrom, $dateTo);
        return response()->json($calendar);
    }
}
