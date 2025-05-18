<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $id_cake_designer
 * @property int $id_decor
 * @property int $count
 */
class CakeDesignerDecorRelation extends Model
{
    use HasFactory;

    public const TABLE_NAME = 'cake_designer_decor_relations';

    protected $table = self::TABLE_NAME;

    public $timestamps = false;

    protected $fillable = [
        'id_cake_designer',
        'id_decor',
        'count',
    ];

    public function decor(): BelongsTo
    {
        return $this->belongsTo(Decor::class, 'id_decor', 'id');
    }

    public function cakeDesigner(): BelongsTo
    {
        return $this->belongsTo(CakeDesigner::class, 'id_cake_designer', 'id');
    }
}
