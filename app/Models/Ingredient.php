<?php

namespace App\Models;

use App\Models\Responses\IngredientResponse;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $name
 * @property string $measurement
 * @property float $quantity_in_stock
 */
class Ingredient extends Model
{
    use HasFactory;

    public const TABLE_NAME = 'ingredients';
    protected $table = self::TABLE_NAME;

    public $timestamps = false;

    /**
     * список полей к которым можно получить доступ для передачи в респонс клиенту
     * @var string[]
     */
    protected $fillable = [
        'name',
        'measurement',
        'quantity_in_stock'
    ];

    public function toResponse(): IngredientResponse
    {
        return new IngredientResponse($this->id, $this->name, $this->measurement, $this->quantity_in_stock);
    }
}
