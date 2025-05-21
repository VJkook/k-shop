<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property int $id
 * @property string $name
 */
class Role extends Model
{
    use HasFactory;

    public const ADMIN_ROLE = 'admin';
    public const CLIENT_ROLE = 'client';

    public const ROLE_BY_NAME = [
        self::ADMIN_ROLE => 1,
        self::CLIENT_ROLE => 2,
    ];

    public const TABLE_NAME = 'roles';

    protected $table = self::TABLE_NAME;

    public $timestamps = false;

    protected $fillable = [
        'name',
    ];

    public function user(): HasOne
    {
        return $this->hasOne(User::class, 'id_user', 'id');
    }

    public static function clientRoleId(): int
    {
        return self::ROLE_BY_NAME[self::CLIENT_ROLE];
    }
}
