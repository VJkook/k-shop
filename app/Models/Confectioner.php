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
class Confectioner extends User
{
   public function busyTimes()
   {

   }
}
