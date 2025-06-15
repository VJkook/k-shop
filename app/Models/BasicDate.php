<?php

namespace App\Models;

use Exception;
use Illuminate\Support\Carbon;

class BasicDate extends Carbon
{
    public const DATE_FORMAT = 'Y-m-d H:i:s';
    public const YEAR_MONTH_DAY_FORMAT = 'Y-m-d';
    public const TIME_FORMAT = 'H:i:s';

    public function toStringDate(): string
    {
        return $this->format(self::DATE_FORMAT);
    }

    public function toStringYearDayMonth(): string
    {
        return $this->format(self::YEAR_MONTH_DAY_FORMAT);
    }

    /**
     * @throws Exception
     */
    public static function fromDateString(string $date): BasicDate
    {
        $instance = BasicDate::createFromFormat(self::DATE_FORMAT, $date);
        if ($instance === false) {
            throw new Exception("Failed to convert date from: '$date'. Please use this format: " . self::DATE_FORMAT);
        }

        return $instance;
    }

    public static function fromYearMonthDayString(string $date): BasicDate
    {
        $instance = BasicDate::createFromFormat(self::YEAR_MONTH_DAY_FORMAT, $date);
        if ($instance === false) {
            throw new Exception("Failed to convert date from: '$date'. Please use this format: " . self::DATE_FORMAT);
        }

        return $instance;
    }

    /**
     * @throws Exception
     */
    public static function fromTimeString(string $time): BasicDate
    {
        $instance = BasicDate::createFromFormat(self::TIME_FORMAT, $time);
        if ($instance === false) {
            throw new Exception("Failed to convert date from: '$time'. Please use this format: " . self::TIME_FORMAT);
        }

        return $instance;
    }


    /**
     * @throws Exception
     */
    public static function fromCarbon(Carbon $carbon): BasicDate
    {
        return self::fromDateString($carbon->format(self::DATE_FORMAT));
    }

//    public function addTime($time1, $time2)
//    {
//        $t1 = Carbon::createFromTimeString($time1);
//        $t2 = Carbon::createFromTimeString($time2);
//
//        return $t1->copy()->addHours($t2->hour)
//            ->addMinutes($t2->minute)
//            ->addSeconds($t2->second)
//            ->format('H:i:s');
//    }
}
