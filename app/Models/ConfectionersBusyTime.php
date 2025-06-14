<?php

namespace App\Models;

use Carbon\CarbonInterval;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $id_confectioner
 * @property CarbonInterval|string|null $busy_date
 * @property Carbon|string|null $work_date
 */
class ConfectionersBusyTime extends Model
{
    use HasFactory;

    public const TABLE_NAME = 'confectioners_busy_time';
    protected $table = self::TABLE_NAME;

    public $timestamps = false;

    protected $fillable = [
        'id_confectioner',
        'cooking_time',
        'busy_time',
        'work_date',
    ];

}
