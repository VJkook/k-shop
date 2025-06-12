<?php

namespace App\Repositories;

use App\Models\BasicIntervalTime;
use App\Models\MaxTimeForCooking;
use Carbon\CarbonInterval;

class MaxTimeForCookingRepository
{

    public function getMax(): BasicIntervalTime
    {
        /** @var CarbonInterval $time */
        $time =  MaxTimeForCooking::query()->max('time');
        return BasicIntervalTime::fromCarbonInterval($time);
    }
}
