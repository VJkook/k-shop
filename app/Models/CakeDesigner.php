<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property string|null $weight
 * @property float|null $total_cost
 * @property int $id_coverage
 * @property int $id_cake_form
 * @property int $id_user
 */
class CakeDesigner extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price_by_kg',
        'weight',
        'id_image',
        'id_coverage',
        'id_cake_form',
        'id_user',
    ];

    protected $table = 'cake_designers';

    public $timestamps = false;

    public function images(): BelongsToMany
    {
        return $this->belongsToMany(
            Image::class,
            CakeDesignerImageRelation::TABLE_NAME,
            'id_cake_designer',
            'id_image'
        );
    }

    public function cakeForm(): BelongsTo
    {
        return $this->belongsTo(CakeForm::class, 'id_cake_form', 'id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user', 'id');
    }

    public function product(): HasOne
    {
        return $this->hasOne(Product::class, 'id_cake_designer', 'id');
    }
}
