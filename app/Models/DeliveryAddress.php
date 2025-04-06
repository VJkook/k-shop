<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $address
 */
class DeliveryAddress extends Model
{
    use HasFactory;

    public const TABLE_NAME = 'delivery_addresses';
    protected $table = 'delivery_addresses';
    public $timestamps = false;
}
