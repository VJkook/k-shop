<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $id_cake_designer
 * @property int $id_filling
 * @property float $weight
 */
class Tier extends Model
{
    use HasFactory;

    protected $table = 'tiers';
    protected $fillable = [
        'id_cake_designer',
        'id_filling',
        'id_cake_sponge',
        'weight',
    ];

    public $timestamps = false;

    public function cakeSponge(): BelongsTo
    {
        return $this->belongsTo(CakeSponge::class, 'id_cake_sponge', 'id');
    }

    public function filling(): BelongsTo
    {
        return $this->belongsTo(Filling::class, 'id_filling', 'id');
    }
}
