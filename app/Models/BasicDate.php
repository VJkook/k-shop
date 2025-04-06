<?php

namespace App\Models;

use Exception;
use Illuminate\Support\Carbon;

class BasicDate extends Carbon
{
    public const DATE_FORMAT = 'Y-m-d H:i:s';

    public function toStringDate(): string
    {
        return $this->format(self::DATE_FORMAT);
    }

    /**
     * @throws Exception
     */
    public static function fromString(string $date): BasicDate
    {
        $instance = BasicDate::createFromFormat(self::DATE_FORMAT, $date);
        if ($instance === false) {
            throw new Exception("Failed to convert date from: '$date'. Please use this format: " . self::DATE_FORMAT);
        }

        return $instance;
    }

    /**
     * @throws Exception
     */
    public static function fromCarbon(Carbon $carbon): BasicDate
    {
        return self::fromString($carbon->format(self::DATE_FORMAT));
    }
}
