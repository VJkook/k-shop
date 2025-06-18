<?php

namespace App\Models;

use App\Models\Responses\Users\ConfectionerBusyResponse;
use DateTime;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
    public function busyTime(): HasMany
    {
        return $this->hasMany(ConfectionersBusyTime::class, 'id_confectioner', 'id');
    }

    public function toConfectionerBusyResponse(?BasicIntervalTime $busyTime): ConfectionerBusyResponse
    {
        $busyTimeStr = null;
        if (!is_null($busyTime)) {
            $busyTimeStr = $busyTime->toStringInterval();
        }

        return new ConfectionerBusyResponse($this->id, $this->name, $this->email, $busyTimeStr);
    }
}
