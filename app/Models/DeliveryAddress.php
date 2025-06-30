<?php

namespace App\Models;

use App\Models\Responses\DeliveryAddressResponse;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property int $id
 * @property string $address
 * @property string|null $comment
 * @property string|null $index
 * @property int $id_user
 */
class DeliveryAddress extends Model
{
    use HasFactory;

    public const string TABLE_NAME = 'delivery_addresses';
    protected $table = self::TABLE_NAME;
    public $timestamps = false;

    protected $fillable = [
        'address',
        'index',
        'comment',
        'id_user'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user', 'id');
    }

    public function toResponse(): DeliveryAddressResponse
    {
        /** @var User $user */
        $user = $this->user()->first();
        return new DeliveryAddressResponse(
            $this->id,
            $this->address,
            $user->toUserResponse(),
            $this->index,
            $this->comment,
        );
    }
}
