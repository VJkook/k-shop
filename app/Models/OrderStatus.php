<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $name
 */
class OrderStatus extends Model
{
    use HasFactory;

    public const TABLE_NAME = 'order_statuses';
    protected $table = 'order_statuses';
    public $timestamps = false;

    public const CONFIRM_WAITING = 1;
}
