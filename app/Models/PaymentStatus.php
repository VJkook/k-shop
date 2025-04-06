<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $name
 */
class PaymentStatus extends Model
{
    use HasFactory;

    public const TABLE_NAME = 'payment_statuses';
    protected $table = 'payment_statuses';
    public $timestamps = false;

    public const PAY_WAITING = 1;
}
