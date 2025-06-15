<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Models\Responses\UserResponse;
use DateTime;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property DateTime $email_verified_at
 * @property string $password
 * @property string $remember_token
 * @property DateTime $created_at
 * @property DateTime $updated_at
 * @property int $id_role
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    public const SYSTEM_USER_ID = 1;

    protected $table = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'id_role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'id_role', 'id');
    }

    public function toUserResponse(): UserResponse
    {
        /** @var Role $role */
        $role = $this->role()->first();
        return new UserResponse($this->id, $this->name, $this->email, $role->name);
    }

    public function toConfectionerResponse(): UserResponse
    {
        /** @var Role $role */
        $role = $this->role()->first();
        return new UserResponse($this->id, $this->name, $this->email, $role->name);
    }

    public function isAdmin(): bool
    {
        return Role::isAdmin($this->id_role);
    }
}
