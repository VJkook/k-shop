<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property float $total_cost
 * @property Carbon $registration_date
 * @property Carbon|null $delivery_date
 * @property Carbon|null $complete_date
 * @property int $id_user
 * @property int $id_delivery_address
 * @property int $id_payment_status
 * @property int $id_order_status
 * @property int $id_confectioner
 */
class Order extends Model
{
    use HasFactory;

    public const TABLE_NAME = 'orders';
    protected $table = 'orders';
    public $timestamps = false;

    protected $fillable = [
        'id_user',
        'total_cost',
        'id_delivery_address',
        'id_payment_status',
        'id_order_status',
        'registration_date',
        'id_confectioner',
    ];

    protected $casts = [
        'registration_date' => 'datetime:' . BasicDate::DATE_FORMAT,
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    public function deliveryAddress(): BelongsTo
    {
        return $this->belongsTo(DeliveryAddress::class, 'id_delivery_address');
    }

    public function paymentStatus(): BelongsTo
    {
        return $this->belongsTo(PaymentStatus::class, 'id_payment_status', 'id');
    }

    public function orderStatus(): BelongsTo
    {
        return $this->belongsTo(OrderStatus::class, 'id_order_status', 'id');
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(
            Product::class,
            ProductOrderRelation::TABLE_NAME,
            'id_order',
            'id_product'
        );
    }
}
