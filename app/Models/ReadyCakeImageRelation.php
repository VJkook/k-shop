<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $id_ready_cake
 * @property int $id_image
 */
class ReadyCakeImageRelation extends Model
{
    use HasFactory;

    public const TABLE_NAME = 'ready_cake_image_relations';

    protected $table = self::TABLE_NAME;

    public $timestamps = false;

    protected $fillable = [
        'id_ready_cake',
        'id_image',
    ];
}
