<?php

namespace App\Models;

use Carbon\CarbonInterval;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property CarbonInterval $time
 */
class MaxTimeForCooking extends Model
{
    use HasFactory;

    protected $fillable = [
        'time',
    ];

    protected $table = 'max_time_for_cooking';

    public $timestamps = false;

    protected $casts = [
        'step_time' => 'datetime:' . BasicIntervalTime::TIME_FORMAT,
    ];
}
