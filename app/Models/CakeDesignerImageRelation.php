<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $id_cake_designer
 * @property int $id_image
 */
class CakeDesignerImageRelation extends Model
{
    use HasFactory;

    public const TABLE_NAME = 'cake_designer_image_relation';

    protected $table = self::TABLE_NAME;

    public $timestamps = false;

    protected $fillable = [
        'id_cake_designer',
        'id_image',
    ];
}
