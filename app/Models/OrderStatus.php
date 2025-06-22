<?php

namespace App\Models;

use App\Models\Responses\OrderStatusResponse;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $name
 * @property string $color
 */
class OrderStatus extends Model
{
    use HasFactory;

    public const TABLE_NAME = 'order_statuses';
    protected $table = 'order_statuses';
    public $timestamps = false;

    public const CONFIRM_WAITING = 1;
    public const COOKING = 2;

    public function toResponse(): OrderStatusResponse
    {
        return new OrderStatusResponse($this->id, $this->name, $this->color);
    }
}
