<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $name
 */
class CakeForm extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    protected $table = 'cake_forms';

    public $timestamps = false;

    public function cakeDesigners(): HasMany
    {
        return $this->hasMany(CakeDesigner::class, 'id_cake_form', 'id');
    }
}
