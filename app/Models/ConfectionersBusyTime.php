<?php

namespace App\Models;

use Carbon\CarbonInterval;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $id_confectioner
 * @property CarbonInterval|string $busy_time
 * @property Carbon|string $work_date
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

    public function confectioner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_confectioner', 'id');
    }
}
