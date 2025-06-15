<?php

namespace App\Models;

use Carbon\CarbonInterval;
use Exception;
use Illuminate\Support\Carbon;

class BasicIntervalTime extends CarbonInterval
{
    public const TIME_FORMAT = 'H:i:s';

    public function toStringInterval(): string
    {
        $format = preg_replace('/(\w)/', '%$1', self::TIME_FORMAT);
        return $this->format($format);
    }

    /**
     * @throws Exception
     */
    public static function fromIntervalString(string $interval): BasicIntervalTime
    {
        $instance = BasicIntervalTime::createFromFormat(self::TIME_FORMAT, $interval);
        if ($instance === false) {
            throw new Exception("Failed to convert date from: '$interval'. Please use this format: " . self::TIME_FORMAT);
        }

        return $instance;
    }


    /**
     * @throws Exception
     */
    public static function fromCarbonInterval(CarbonInterval $carbon): BasicIntervalTime
    {
        return self::fromIntervalString($carbon->format(self::TIME_FORMAT));
    }
}
